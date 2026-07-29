const testData = require("./references.ct");

import NullDocumentationGenerator from "../../../src/generateTS/docgen/nulldoc";
import tsgenFactory from "../../../src/generateTS/factory";

const tsgen = tsgenFactory({
  docgen: new NullDocumentationGenerator(),
  naming: {
    prefix: "I",
  },
});

const tsgenWithReferencedEntry = tsgenFactory({
  docgen: new NullDocumentationGenerator(),
  naming: {
    prefix: "I",
  },
  includeReferencedEntry: true,
});

describe("references", () => {
  describe("with ReferencedEntry disabled (default)", () => {
    const result = tsgen(testData.references);

    test("metadata", () => {
      const contentTypes = [...result.metadata.dependencies.contentTypes];

      expect(contentTypes).toEqual(
        expect.arrayContaining([
          "IReferenceChild",
          "IBoolean",
          "IBuiltinExample",
        ])
      );
    });

    test("definition", () => {
      expect(result.definition).toMatchInlineSnapshot(`
        "export interface IReferenceParent
        {
        _version?: number;
        title: string;
        url: string;
        single_reference: (IReferenceChild)[];
        multiple_reference?: (IReferenceChild | IBoolean | IBuiltinExample)[];
        }"
      `);
    });
  });

  describe("with ReferencedEntry enabled", () => {
    const result = tsgenWithReferencedEntry(testData.references);

    test("metadata", () => {
      const contentTypes = [...result.metadata.dependencies.contentTypes];

      expect(contentTypes).toEqual(
        expect.arrayContaining([
          "IReferenceChild",
          "IBoolean",
          "IBuiltinExample",
        ])
      );
    });

    test("definition", () => {
      expect(result.definition).toMatchInlineSnapshot(`
        "export interface IReferenceParent
        {
        _version?: number;
        title: string;
        url: string;
        single_reference: (IReferenceChild | IReferencedEntry)[];
        multiple_reference?: (IReferenceChild | IBoolean | IBuiltinExample | IReferencedEntry)[];
        }"
      `);
    });
  });

  describe("with typedSdk enabled", () => {
    const tsgenTypedSdk = tsgenFactory({
      docgen: new NullDocumentationGenerator(),
      naming: { prefix: "I" },
      typedSdk: true,
      // typedSdk supersedes this for reference fields
      includeReferencedEntry: true,
    });

    test("reference fields become Ref<Target> instead of a stub union", () => {
      const result = tsgenTypedSdk(testData.references);

      expect(result.definition).toContain(
        "single_reference: Ref<IReferenceChild>;"
      );
      expect(result.definition).toContain(
        "multiple_reference?: Ref<IReferenceChild | IBoolean | IBuiltinExample>;"
      );
      expect(result.definition).not.toContain("IReferencedEntry");
    });

    test("Ref<> is not array-wrapped again for multiple reference fields", () => {
      // Ref<T> is already array-shaped, and the SDK's stub-versus-resolved
      // detection depends on that exact shape, so `multiple` must not add `[]`.
      const multipleRef = {
        ...testData.references,
        uid: "reference_parent_multiple",
        schema: testData.references.schema.map((field: any) =>
          field.uid === "single_reference"
            ? { ...field, multiple: true }
            : field
        ),
      };

      const result = tsgenTypedSdk(multipleRef);

      expect(result.definition).toContain(
        "single_reference: Ref<IReferenceChild>;"
      );
      expect(result.definition).not.toContain("Ref<IReferenceChild>[]");
    });
  });
});
