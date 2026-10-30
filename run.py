"""اجرای محیط توسعه: ابتدا Django، سپس Tailwind و در پایان مرورگر."""

import argparse
import os
from pathlib import Path
import shutil
import signal
import socket
import subprocess
import sys
import time
from urllib.request import ProxyHandler, build_opener
import webbrowser


ROOT = Path(__file__).resolve().parent


def start(command, directory):
    return subprocess.Popen(
        command, cwd=directory, start_new_session=(os.name == 'posix')
    )


def stop(process):
    if os.name == 'posix':
        try:
            os.killpg(process.pid, signal.SIGTERM)
        except ProcessLookupError:
            return
    elif process.poll() is None:
        subprocess.run(
            ['taskkill', '/PID', str(process.pid), '/T', '/F'],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False,
        )
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        if os.name == 'posix':
            try:
                os.killpg(process.pid, signal.SIGKILL)
            except ProcessLookupError:
                pass
        else:
            process.kill()
        process.wait()


def wait_until(process, ready, name):
    deadline = time.monotonic() + 30
    while time.monotonic() < deadline:
        if process.poll() is not None:
            raise RuntimeError(f'{name} متوقف شد؛ خطای نمایش‌داده‌شده را بررسی کنید.')
        try:
            if ready():
                return
        except OSError:
            pass
        time.sleep(0.1)
    raise RuntimeError(f'{name} در مهلت ۳۰ ثانیه آماده نشد.')


def interrupt(_signum, _frame):
    raise KeyboardInterrupt


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8000, help='پورت Django؛ پیش‌فرض 8000')
    parser.add_argument('--no-browser', action='store_true', help='مرورگر باز نشود')
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error('پورت باید بین 1 و 65535 باشد.')

    processes = []
    signal.signal(signal.SIGTERM, interrupt)
    try:
        python = ROOT / '.venv' / ('Scripts/python.exe' if os.name == 'nt' else 'bin/python')
        if not python.is_file():
            raise RuntimeError('محیط .venv موجود نیست؛ مراحل نصب در README.fa.md را انجام دهید.')
        npm = shutil.which('npm')
        if not npm or not (ROOT / 'frontend/node_modules/@tailwindcss/cli').is_dir():
            raise RuntimeError('Node.js و npm لازم‌اند؛ سپس npm --prefix frontend ci را اجرا کنید.')
        with socket.socket() as port_check:
            port_check.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                port_check.bind(('127.0.0.1', args.port))
            except OSError as error:
                raise RuntimeError(f'پورت {args.port} قابل استفاده نیست؛ --port را تغییر دهید.') from error

        url = f'http://127.0.0.1:{args.port}/'
        opener = build_opener(ProxyHandler({}))

        def backend_ready():
            with opener.open(url, timeout=1) as response:
                return response.status == 200

        print('۱. اجرای بک‌اند Django…', flush=True)
        backend = start([str(python), 'manage.py', 'runserver', f'127.0.0.1:{args.port}'], ROOT / 'backend')
        processes.append(backend)
        wait_until(backend, backend_ready, 'Django')

        print('۲. ساخت CSS و اجرای فرانت‌اند در حالت watch…', flush=True)
        css_build = start([npm, 'run', 'build:css'], ROOT / 'frontend')
        processes.append(css_build)
        if css_build.wait() != 0:
            raise RuntimeError('ساخت CSS ناموفق بود.')
        processes.remove(css_build)
        css = ROOT / 'frontend/static/css/app.css'
        previous_build = css.stat().st_mtime_ns
        frontend = start([npm, 'run', 'watch:css', '--', '--watch=always'], ROOT / 'frontend')
        processes.append(frontend)
        wait_until(frontend, lambda: css.stat().st_mtime_ns != previous_build, 'Tailwind')
        if backend.poll() is not None:
            raise RuntimeError('Django هنگام آماده‌سازی فرانت‌اند متوقف شد.')

        print(f'پروژه آماده است: {url}\nبرای توقف هر دو بخش Ctrl+C را بزنید.', flush=True)
        if not args.no_browser and not webbrowser.open(url, new=2):
            print('مرورگر خودکار باز نشد؛ نشانی بالا را در مرورگر باز کنید.', flush=True)

        while True:
            for name, process in (('Django', backend), ('Tailwind', frontend)):
                if process.poll() is not None:
                    raise RuntimeError(f'{name} متوقف شد (کد خروج {process.returncode}).')
            time.sleep(0.5)
    except KeyboardInterrupt:
        print('\nدر حال توقف محیط توسعه…', flush=True)
    except (OSError, RuntimeError, subprocess.SubprocessError) as error:
        print(f'خطا: {error}', file=sys.stderr, flush=True)
        return 1
    finally:
        for process in reversed(processes):
            stop(process)
    return 0


if __name__ == '__main__':
    sys.exit(main())
