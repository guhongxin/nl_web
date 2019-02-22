FROM nginx:1.15

COPY dist/ /usr/share/nginx/html/saas/
COPY dist/static/ /usr/share/nginx/html/static/
COPY dist/static/index.html /usr/share/nginx/html/