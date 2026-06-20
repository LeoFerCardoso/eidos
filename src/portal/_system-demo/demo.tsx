'use client';
import * as React from 'react';
import { Box, Stack, Inline } from '@eidos/ui';

/** Reference: a portal fragment built entirely from the typed vocabulary. */
export function SystemDemo() {
  return (
    <Stack as="section" gap="4" p="6" background="surface" radius="lg" borderColor="border">
      <Inline justify="between" align="center">
        <Box as="h2" color="fg">Incidents</Box>
        <Inline gap="2">
          <Box as="span" color="fg-muted">12 open</Box>
        </Inline>
      </Inline>
      <Box as="ul" display="flex" direction="col" gap="2">
        <Box as="li" px="3" py="2" background="bg-elevated" radius="md">SEV-1 · db latency</Box>
        <Box as="li" px="3" py="2" background="bg-elevated" radius="md">SEV-2 · cache miss</Box>
      </Box>
    </Stack>
  );
}
