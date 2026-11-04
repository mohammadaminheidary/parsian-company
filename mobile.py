"""اجرای سایت روی شبکهٔ محلی برای باز کردن در مرورگر گوشی."""

import ipaddress
import shutil
import socket
import subprocess
import sys

import run


def get_lan_addresses():
    addresses = []

    def add(value):
        try:
            address = ipaddress.IPv4Address(value)
        except ipaddress.AddressValueError:
            return
        if not (address.is_loopback or address.is_unspecified or address.is_multicast
                or address.is_link_local or address.is_reserved):
            if str(address) not in addresses:
                addresses.append(str(address))

    # Prefer physical network interfaces on macOS, including when a VPN is active.
    if sys.platform == 'darwin' and shutil.which('ipconfig'):
        for interface in ('en0', 'en1'):
            try:
                result = subprocess.run(
                    ['ipconfig', 'getifaddr', interface], capture_output=True,
                    text=True, timeout=2, check=False,
                )
                if result.returncode == 0:
                    add(result.stdout.strip())
            except (OSError, subprocess.TimeoutExpired):
                pass
        if addresses:
            return addresses

    # UDP connect selects the route's local address without sending any packet.
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as connection:
            connection.connect(('192.0.2.1', 80))
            add(connection.getsockname()[0])
    except OSError:
        pass
    try:
        for result in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
            add(result[4][0])
    except OSError:
        pass
    return addresses


if __name__ == '__main__':
    sys.exit(run.main(lan_addresses=get_lan_addresses()))
