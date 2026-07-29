const testData = require("./modular.blocks.ct");

import NullDocumentationGenerator from "../../../src/generateTS/docgen/nulldoc";
import tsgenFactory from "../../../src/generateTS/factory";

const tsgen = tsgenFactory({
  docgen: new NullDocumentationGenerator(),
});

describe("modular blocks", () => {
  const result = tsgen(testData.modularBlocks);

  test("metadata", () => {
    const types = result.metadata.types;
    expect([...types.contentstack]).toHaveLength(0);
    expect([...types.globalFields]).toHaveLength(0);
  });

  test("definition", () => {
    expect(result.definition).toMatchInlineSnapshot(`
      "export interface ModularBlocks {
      string_block: {
       single_line?: string;
      multi_line?: string;
      markdown?: string;
      rich_text_editor?: string; }
      string_block_with_options: {
       single_line_textbox_required: string;
      single_line_textbox_multiple?: string[]; }
      boolean_block: {
       boolean: boolean; }
      }

      export interface ModularBlocks
      {
      _version?: number;
      title: string;
      url: string;
      modular_blocks?: ModularBlocks[];
      }"
    `);
  });
});

describe("modular blocks with system fields", () => {
  const tsgenWithSystemFields = tsgenFactory({
    docgen: new NullDocumentationGenerator(),
    systemFields: true,
  });

  const result = tsgenWithSystemFields(testData.modularBlocks);

  // A block container's keys are block uids, and ModularBlocksExtension<T> maps
  // over keyof T, so inheriting entry fields here would offer uid/ACL/title/...
  // as block names. The CDA returns only the block key inside a block element,
  // so those inherited fields do not exist at runtime either.
  test("modular block interfaces do not extend SystemFields", () => {
    expect(result.definition).toContain("export interface ModularBlocks {");
  });

  test("content type interface extends SystemFields", () => {
    // The entry interface is emitted with its brace on the following line.
    expect(result.definition).toContain(
      "export interface ModularBlocks extends SystemFields"
    );
    expect(result.definition).toMatch(
      /export interface ModularBlocks extends SystemFields\s*\{/
    );
  });

  test("modular block interface contains all expected fields", () => {
    expect(result.definition).toContain("string_block:");
    expect(result.definition).toContain("string_block_with_options:");
    expect(result.definition).toContain("boolean_block:");
  });
});

describe("modular blocks with system fields and prefix", () => {
  const tsgenWithSystemFieldsAndPrefix = tsgenFactory({
    docgen: new NullDocumentationGenerator(),
    systemFields: true,
    naming: {
      prefix: "I",
    },
  });

  const result = tsgenWithSystemFieldsAndPrefix(testData.modularBlocks);

  test("modular block interfaces do not extend prefixed SystemFields", () => {
    expect(result.definition).toContain("export interface IModularBlocks {");
  });

  test("prefixed content type interface extends prefixed SystemFields", () => {
    expect(result.definition).toMatch(
      /export interface IModularBlocks extends ISystemFields\s*\{/
    );
  });
});
