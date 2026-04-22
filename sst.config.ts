/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst-bug-repro",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const secret = new sst.Secret("SecretKey", "default-value");
    const bus = new sst.aws.Bus("Bus");

    const environment = {
      SECRET_KEY: secret.value,
      // NOTE: Uncomment the line below after doing an initial deploy to trigger a change
      // HELLO: "world",
    };

    const link = [secret];

    new sst.aws.Function("MyFunction", {
      handler: "src/lambda.handler",
    });

    const workflow = new sst.aws.Workflow("Workflow", {
      handler: "src/workflow.handler",
      environment,
      link,
    });

    bus.subscribe("WorkflowSubscriber", workflow);
  },
});
