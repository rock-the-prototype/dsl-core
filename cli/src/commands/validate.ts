import { validatePath } from "../../../src/mod.ts";

export async function cmdValidate(
  target: string,
  opts: { json: boolean; pretty: boolean },
) {
  const files = await validatePath(target);

  const hasParserErrors = files.some((f) =>
    f.statements.some((s) => !!s.error)
  );
  const hasInvalid = files.some((f) =>
    f.statements.some((s) => s.validation && !s.validation.valid)
  );

  if (opts.json) {
    console.log(JSON.stringify(files, null, opts.pretty ? 2 : 0));
  } else {
    for (const f of files) {
      const invalid = f.statements.filter((s) =>
        s.validation && !s.validation.valid
      ).length;
      const parseErr = f.statements.filter((s) => s.error).length;
      const ok = f.statements.length - invalid - parseErr;
      console.log(
        `${f.path}: OK=${ok} INVALID=${invalid} PARSE_ERR=${parseErr}`,
      );
    }
  }

  Deno.exit(hasParserErrors ? 2 : hasInvalid ? 1 : 0);
}
