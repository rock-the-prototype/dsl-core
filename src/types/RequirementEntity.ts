/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

export interface RequirementEntity {
    id: string;  // domain-level ID
    title?: string;
    description?: string;
    source?: string;
    version?: string;

    // Parsed DSL
    actor?: string;
    modality?: string;
    action?: string;
    condition?: string;
    result?: string;

    raw?: string;
    normalized?: string;
}