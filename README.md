# sst-bug-repro

Minimal reproduction of this issue https://github.com/anomalyco/sst/issues/6804


## Setup

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun run dev
```

You should see the stack deploy correctly

## Reproduce the issue

Uncomment the `HELLO` environment variable in the `sst.config.ts` with `sst dev` running. 

You should see a bunch of errors like this:

```
MyFunction sst:aws:Function → MyFunctionFunction aws:lambda:Function sdk-v2/provider2.go:572: sdk.helper_schema: waiting for Lambda Function (sst-bug-repro-abhishekchadha-MyFunctionFunction-hcmmmfvd) code up date: unexpected state 'Failed', wanted target 'Successful'. last error: InvalidZipFileException: Failed to unzip archive: An error in the  archive format was detected. Please fix the error and retry;: provider=aws@7.20.0

Workflow sst:aws:Workflow → WorkflowHandlerFunction aws:lambda:Function sdk-v2/provider2.go:572: sdk.helper_schema: waiting for Lambda Function (sst-bug-repro-abhishekchadha-WorkflowHandlerFunction-krdwcrab) co de update: unexpected state 'Failed', wanted target 'Successful'. last error: InvalidZipFileException: Failed to unzip archive: An error i n the archive format was detected. Please fix the error and retry;: provider=aws@7.20.0
```

Now the system is in a broken state, you cannot update anything anymore. 

## Getting it to work again
The only way I found to get it to work again is to delete the stack and the `.sst` directory and run `sst dev` again. What didn't work was:
    - Restarting
    - Running `sst state repair` or `sst refresh`
    - Deleting `.sst` and running `sst dev` again


Delete the stack:

```bash
sst remove
```

Delete the `.sst` directory:

```bash
rm -rf .sst
```

Run `sst dev` again. You should see the stack deploy correctly.

## Observations

- Seems like a clean intial deploy works
- Somehow changing the stack puts the function archives into a weird state
- Simply re-creating the stack does not work, you have to delete the stack and the `.sst` directory and run `sst dev` again
- Inspecting the function archives in `.sst/artifacts` shows there is some archiving issue

```
╭─   ~/Desktop/sst-bug-repro   main ?8 ··································································································· ▼  base  12:15:16 AM ─╮
╰─❯ zip -F ./.sst/artifacts/dev-bridge-us-west-2/code.zip --out fixed.zip                                                                                             ─╯
Fix archive (-F) - assume mostly intact archive
Zip entry offsets do not need adjusting
 copying: ./
 copying: bootstrap
 copying: index.mjs
        zip warning: Did not find entry for index.mjs
        zip warning: bad - skipping: index.mjs
```