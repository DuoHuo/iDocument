install:
	@npm --registry=http://registry.npm.taobao.org install

dev: install
	@npm run dev

clean:
	@rm -rf node_modules

pull:
	@git pull origin master

deploy: pull
	@make install
	@pm2 restart idoc

