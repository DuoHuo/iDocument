install:
	@npm --registry=http://registry.npm.taobao.org install

dev: install
	@npm run dev

clean:
	@rm -rf node_modules