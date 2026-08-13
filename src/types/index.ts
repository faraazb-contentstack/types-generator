export interface StackConnectionConfig {
  apiKey: string;
  token: string;
  region:
    | "US"
    | "EU"
    | "AU"
    | "AWS-NA"
    | "AWS-EU"
    | "AWS-AU"
    | "AZURE_NA"
    | "AZURE_EU"
    | "GCP_NA"
    | "GCP_EU"
    | "CUSTOM";
  environment: string;
  branch?: string;
  host?: string;
}

export interface GenerateTSBase extends StackConnectionConfig {
  tokenType: "delivery";
  prefix?: string;
  includeDocumentation?: boolean;
  systemFields?: boolean;
  isEditableTags?: boolean;
  includeReferencedEntry?: boolean;
  /**
   * Emit output wired to @contentstack/delivery-sdk: reference fields become
   * Ref<Target> and a ContentTypeRegistry module augmentation is appended, so
   * stack.contentType("uid") and the entry/query chain type themselves without
   * explicit generics. Requires @contentstack/delivery-sdk to be installed,
   * because the output imports Ref from it. Supersedes includeReferencedEntry
   * for reference fields. REST only — graphqlTS does not support it.
   */
  typedSdk?: boolean;
  /**
   * Name to register this stack under when a project uses more than one stack
   * or branch. With typedSdk, the output augments StackRegistry[stackAlias]
   * instead of the flat ContentTypeRegistry, and the alias is passed at
   * construction: contentstack.stack<'marketing'>({ ... }). Because a stack's
   * schema depends on its branch, generate one alias per (apiKey, branch).
   * Ignored unless typedSdk is enabled.
   */
  stackAlias?: string;
  logger?: any;
}

export type GenerateTS = GenerateTSBase;

export interface GraphQLBase extends StackConnectionConfig {
  namespace?: string;
  logger?: any;
}

export interface GenerateTSFromContentTypes {
  contentTypes: any[];
  prefix?: string;
  includeDocumentation?: boolean;
  systemFields?: boolean;
  isEditableTags?: boolean;
  includeReferencedEntry?: boolean;
  /** See GenerateTSBase.typedSdk. */
  typedSdk?: boolean;
  /**
   * Name to register this stack under when a project uses more than one stack
   * or branch. With typedSdk, the output augments StackRegistry[stackAlias]
   * instead of the flat ContentTypeRegistry, and the alias is passed at
   * construction: contentstack.stack<'marketing'>({ ... }). Because a stack's
   * schema depends on its branch, generate one alias per (apiKey, branch).
   * Ignored unless typedSdk is enabled.
   */
  stackAlias?: string;
  logger?: any;
}
