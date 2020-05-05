from http.server import HTTPServer, CGIHTTPRequestHandler

host='localhost'
port=1111

server_address = (host, port)
httpd = HTTPServer(server_address, CGIHTTPRequestHandler)
httpd.serve_forever()