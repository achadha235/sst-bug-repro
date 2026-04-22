import { workflow } from "sst/aws/workflow";

export const handler = workflow.handler(async (event, ctx) => {
  const user = await ctx.step("load-user", async () => {
    return { id: "user_123", email: "alice@example.com" };
  });

  await ctx.wait("pause-before-email", { minutes: 1 });

  return ctx.step("send-email", async () => {
    return { sent: true, userId: user.id };
  });
});
