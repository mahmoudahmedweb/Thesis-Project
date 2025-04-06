import { createHandler } from "../server.js";

export default createHandler({
  path: "/clerk",
  methods: ["POST"],
});
