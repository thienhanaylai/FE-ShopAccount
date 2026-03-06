#!/bin/bash
# Chạy script này MỘT LẦN trên Azure VM để cài đặt môi trường
# Yêu cầu: Ubuntu 20.04/22.04, chạy với sudo

set -e

echo "==> Cập nhật hệ thống..."
apt-get update -y && apt-get upgrade -y

echo "==> Cài đặt Apache2..."
apt-get install -y apache2

echo "==> Bật các module Apache cần thiết..."
a2enmod rewrite proxy proxy_http proxy_https ssl headers

echo "==> Tạo thư mục web root..."
mkdir -p /var/www/shopaccount
chown -R www-data:www-data /var/www/shopaccount
chmod -R 755 /var/www/shopaccount

echo "==> Copy cấu hình Apache..."
# Sửa ServerName trong file conf trước khi copy nếu cần
cp apache/shopaccount.conf /etc/apache2/sites-available/shopaccount.conf

echo "==> Kích hoạt site và tắt default..."
a2ensite shopaccount.conf
a2dissite 000-default.conf

echo "==> Cho phép deploy không cần password (thêm vào sudoers)..."
# Cho phép user hiện tại reload apache2 không cần mật khẩu
CURRENT_USER=$(logname 2>/dev/null || echo "$SUDO_USER")
echo "$CURRENT_USER ALL=(ALL) NOPASSWD: /bin/systemctl reload apache2" >> /etc/sudoers.d/apache-reload
chmod 0440 /etc/sudoers.d/apache-reload

echo "==> Mở firewall port 80 và 443..."
ufw allow 'Apache Full'
ufw --force enable

echo "==> Khởi động Apache..."
systemctl enable apache2
systemctl restart apache2

echo ""
echo "====================================="
echo " Cài đặt xong!"
echo " Web root : /var/www/shopaccount"
echo " Config   : /etc/apache2/sites-available/shopaccount.conf"
echo "====================================="
echo ""
echo "Bước tiếp theo:"
echo "  1. Sửa ServerName trong /etc/apache2/sites-available/shopaccount.conf"
echo "  2. (Tuỳ chọn) Cài SSL: apt install certbot python3-certbot-apache && certbot --apache"
echo "  3. Thêm Secrets vào GitHub repo:"
echo "     - VM_HOST  : IP hoặc domain của VM"
echo "     - VM_USER  : tên user SSH"
echo "     - VM_SSH_KEY: nội dung private key SSH"
