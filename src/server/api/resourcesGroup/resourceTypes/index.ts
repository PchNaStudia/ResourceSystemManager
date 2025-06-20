import { Router } from 'express';
import { z } from 'zod';
import db, { resourceType } from '@server/db';
import { eq, and } from 'drizzle-orm';
import {ResourceTypeCreateSchema, ResourceTypeUpdateSchema} from "@common/ApiTypes";

// Router
const resourceTypeRouter = Router();

resourceTypeRouter.get('/', async (req, res) => {
  try {
    const groupId = req.resourceGroup!.id;
    const result = await db.select().from(resourceType).where(eq(resourceType.groupId, groupId));
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

resourceTypeRouter.get('/:id', async (req, res) => {
  try {
    const id = z.coerce.number().parse(req.params.id);
    const groupId = req.resourceGroup!.id;

    const [result] = await db
      .select()
      .from(resourceType)
      .where(and(eq(resourceType.id, id), eq(resourceType.groupId, groupId)));

    if (!result) {
      res.status(404).json({ error: 'Resource type not found' });
      return;
    }

    res.json(result);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

resourceTypeRouter.post('/', async (req, res) => {
  try {
    if (req.resourceAccess && !req.resourceAccess.create) {
      res.status(403).json({ error: 'You do not have permission to create resource types' });
      return;
    }

    const data = ResourceTypeCreateSchema.parse(req.body);
    await db.insert(resourceType).values(data);
    res.status(201).send();
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

resourceTypeRouter.put('/:id', async (req, res) => {
  try {
    if (req.resourceAccess && !req.resourceAccess.update) {
      res.status(403).json({ error: 'You do not have permission to update resource types' });
      return;
    }

    const id = z.coerce.number().parse(req.params.id);
    const data = ResourceTypeUpdateSchema.parse(req.body);

    const [result] = await db
      .update(resourceType)
      .set(data)
      .where(and(eq(resourceType.id, id), eq(resourceType.groupId, req.resourceGroup!.id)));

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Resource type not found' });
      return;
    }

    res.status(200).send();
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

resourceTypeRouter.delete('/:id', async (req, res) => {
  try {
    if (req.resourceAccess && !req.resourceAccess.delete) {
      res.status(403).json({ error: 'You do not have permission to delete resource types' });
      return;
    }

    const id = z.coerce.number().parse(req.params.id);

    const [result] = await db
      .delete(resourceType)
      .where(and(eq(resourceType.id, id), eq(resourceType.groupId, req.resourceGroup!.id)));

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Resource type not found' });
      return;
    }

    res.status(200).send();
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default resourceTypeRouter;
