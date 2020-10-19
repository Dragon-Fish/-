# 设置 composer 镜像

**composer**是 PHP 的包管理程序，官方源访问速度极其感人，建议使用阿里云镜像。（马云霸霸牛批）

文档：https://developer.aliyun.com/composer

## 下载 composer

```bash
# 下载
wget https://mirrors.aliyun.com/composer/composer.phar
# 配置为环境变量
sudo mv ./composer.phar /usr/bin/composer
# 检查是否可用
composer --version
```

## 全局设置镜像

```bash
composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/
```

## 以上

速度↑↑↑
