import { createServer } from "node:http";

const posts = [
  {
    id: 1,
    userId: 1,
    title: "Server Components на практике",
    body: "Данные загружаются на сервере, клиент получает готовую разметку.",
  },
  {
    id: 2,
    userId: 2,
    title: "Валидация на границах",
    body: "Zod проверяет и пользовательский ввод, и ответ внешнего API.",
  },
  {
    id: 3,
    userId: 3,
    title: "Поиск через URL",
    body: "Строка запроса живёт в адресе страницы и переживает перезагрузку.",
  },
];

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  response.setHeader("Content-Type", "application/json");

  if (request.method === "GET" && url.pathname === "/posts") {
    response.writeHead(200);
    response.end(JSON.stringify(posts));
    return;
  }

  const match = url.pathname.match(/^\/posts\/(\d+)$/);

  if (request.method === "GET" && match) {
    const post = posts.find((item) => item.id === Number(match[1]));

    if (!post) {
      response.writeHead(404);
      response.end(JSON.stringify({}));
      return;
    }

    response.writeHead(200);
    response.end(JSON.stringify(post));
    return;
  }

  if (request.method === "POST" && url.pathname === "/posts") {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      response.writeHead(201);
      response.end(JSON.stringify({ id: 101, ...JSON.parse(body || "{}") }));
    });
    return;
  }

  response.writeHead(404);
  response.end(JSON.stringify({}));
});

server.listen(4100, "127.0.0.1");

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
