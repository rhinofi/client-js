/**
 * Simple typing file for manually adding types
 */

type ParametersExceptFirst<F> = F extends (head: any, ...tail: infer R) => any ? R : never