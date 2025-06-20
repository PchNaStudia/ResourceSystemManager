import {NextFunction, Request, Response, Router} from 'express';
import db, {resourcesAccess, resourcesGroups} from '@server/db';
import {z} from 'zod';
import {and, eq, or} from "drizzle-orm";
import {ResourceGroupAccessListSchema, ResourceGroupAccessSchema, UpdateResourceGroupSchema} from "@common/ApiTypes";
import resourceRouter from "@server/api/resourcesGroup/resource";
import resourceTypeRouter from "@server/api/resourcesGroup/resourceTypes";
import resourceAccessRouter from "@server/api/resourcesGroup/resourceAccess";
import reservationsRouter from "@server/api/resourcesGroup/reservations";
import resourceAccess from "@server/api/resourcesGroup/resourceAccess";

const resourcesGroupRouter = Router();

resourcesGroupRouter.get('/', async (req, res) => {
  const access = await db.select({
    resourceGroups: resourcesGroups, resourcesAccess: resourcesAccess
  }).from(resourcesGroups)
    .leftJoin(resourcesAccess, and(eq(resourcesGroups.id, resourcesAccess.groupId), eq(resourcesAccess.userId, req.user!.id)))
    .where(or(eq(resourcesAccess.userId, req.user!.id), eq(resourcesGroups.ownerId, req.user!.id)))
  res.json(ResourceGroupAccessListSchema.parse(access));
})

resourcesGroupRouter.get('/:id', async (req, res) => {
  const groupId = z.coerce.number().parse(req.params.id)
  const access = (await db.select({
    resourceGroups: resourcesGroups, resourcesAccess: resourcesAccess
  }).from(resourcesGroups)
    .leftJoin(resourcesAccess, and(eq(resourcesGroups.id, resourcesAccess.groupId), eq(resourcesAccess.userId, req.user!.id)))
    .where(and(eq(resourcesGroups.id, groupId), or(eq(resourcesAccess.userId, req.user!.id), eq(resourcesGroups.ownerId, req.user!.id))))
    .limit(1))[0]
  if (!access) {
    res.status(404).json({error: 'Group not found'})
    return
  }
  const isOwner = access.resourceGroups.ownerId === req.user!.id;
  if (!access.resourcesAccess && !isOwner) {
    res.status(401).json({error: 'Unauthorized'})
    return
  }
  res.json(ResourceGroupAccessSchema.parse(access));
})

resourcesGroupRouter.post('/', async (req, res) => {
  const id = await db.insert(resourcesGroups).values({
    ownerId: req.user!.id
  })
    .$returningId()
  res.json(id[0])
})

resourcesGroupRouter.put('/:id', async (req, res) => {
  const {ownerId} = UpdateResourceGroupSchema.parse(req.body);
  const groupId = z.coerce.number().parse(req.params.id)
  try {
    await db.transaction(async (tx)=>{
      const [result] = await tx.update(resourcesGroups).set({
        ownerId,
      }).where(and(eq(resourcesGroups.id, groupId), eq(resourcesGroups.ownerId, req.user!.id)))
      if(result.affectedRows === 0) {
        res.status(404).json({error: "Could not update resource group"})
        tx.rollback();
      }
      await tx.delete(resourcesAccess).where(and(
        eq(resourcesAccess.groupId, groupId),
        eq(resourcesAccess.userId, ownerId)
      ))
      await tx.insert(resourcesAccess).values({
        userId: req.user!.id,
        groupId: groupId,
        manageAccess: true,
        delete: true,
        create: true,
        update: true,
        reserveLevel: 'APPROVE'
      })
      res.status(200).send()
    })
    res.status(400).json({error: "Could not update resource group"})
  } catch {
    res.status(500).json({error: "Internal server error"})
  }
})

resourcesGroupRouter.delete('/:id', async (req, res) => {
  const groupId = z.coerce.number().parse(req.params.id)
  try {
    await db.delete(resourcesGroups).where(and(eq(resourcesGroups.ownerId, req.user!.id), eq(resourcesGroups.id, groupId))).limit(1)
    res.status(200).send()
  } catch {
    res.status(400).json({error: "Could not delete resource group"})
  }
})

const resourcesGroupMiddleware = async (req:Request, res:Response, next:NextFunction) => {
  const groupId = z.coerce.number().parse(req.params.id)
  const access = (await db.select({
    resourcesAccess: resourcesAccess, resourcesGroups: resourcesGroups
  }).from(resourcesGroups)
    .leftJoin(resourcesAccess, and(eq(resourcesGroups.id, resourcesAccess.groupId), eq(resourcesAccess.userId, req.user!.id)))
    .where(and(eq(resourcesGroups.id, groupId), or(eq(resourcesAccess.userId, req.user!.id), eq(resourcesGroups.ownerId, req.user!.id))))
    .limit(1))[0]
  if (!access) {
    res.status(404).json({error: 'Group not found'})
    return
  }
  const isOwner = access.resourcesGroups.ownerId === req.user!.id;
  if (!access.resourcesAccess && !isOwner) {
    res.status(401).json({error: 'Unauthorized'})
    return
  }
  req.resourceAccess = access.resourcesAccess;
  req.resourceGroup = access.resourcesGroups;
  next();
}

resourcesGroupRouter.use('/:id/resource', resourcesGroupMiddleware, resourceRouter);

resourcesGroupRouter.use('/:id/types', resourcesGroupMiddleware, resourceTypeRouter);

resourcesGroupRouter.use('/:id/access', resourcesGroupMiddleware, resourceAccessRouter);

resourcesGroupRouter.use('/:id/reservations', resourcesGroupMiddleware, reservationsRouter)


export default resourcesGroupRouter;