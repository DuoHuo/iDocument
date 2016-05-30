install:
	@npm --registry=http://registry.npm.taobao.org install

dev: install
	@npm run dev

clean:
	@rm -rf node_modules

deploy: install
	@git pull origin master
	@pm2 restart idoc

