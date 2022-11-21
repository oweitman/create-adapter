import type { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	if (!devcontainer) return;

	const adapterNameLowerCase = answers.adapterName.toLowerCase();

	const template = `
worker_processes 1;
events { worker_connections 1024; }

http {
  sendfile           on;
  keepalive_timeout  65;

  server {
    listen 80;

    location / {
      error_page 418 = @websocket;      
      proxy_redirect off;
      proxy_pass     http://iobroker:8081;
      if ( $args ~ "sid=" ) { return 418; }      
    }

    location @websocket {
      proxy_pass         http://iobroker:8081;
      proxy_http_version 1.1;
      proxy_set_header   Upgrade $http_upgrade;
      proxy_set_header   Connection "Upgrade";
      proxy_read_timeout 86400;
      proxy_send_timeout 86400;
    }


    location /adapter/${adapterNameLowerCase}/ {
      alias /workspace/admin/;
    }
  }
}`;
	return template.trim();
};

templateFunction.customPath = ".devcontainer/nginx/nginx.conf";
templateFunction.noReformat = true;
export = templateFunction;
