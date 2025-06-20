import {Router} from 'express';
import {CreateResourceGroupAccessSchema, ResourceAccessSchema} from "@common/ApiTypes";
import db, {resourcesAccess} from "@server/db";
import {and, eq, not} from "drizzle-orm";
import {z} from "zod";

const resourceAccessRouter = Router();

resourceAccessRouter.get('/', (req, res) => {
  res.json(ResourceAccessSchema.parse(req.resourceAccess))
})

resourceAccessRouter.use((req, res, next) => {
  if (req.resourceAccess && !req.resourceAccess.manageAccess) {
    res.status(401).json({error: "You do not have permission to manage access"})
    return;
  }
  next();
})

resourceAccessRouter.get('/:userId', async(req, res) => {
  try{
    const userId = z.string().parse(req.params.userId)
    const userAccess = (await db.select().from(resourcesAccess).where(
      and(
        eq(resourcesAccess.groupId, req.resourceGroup!.id),
        eq(resourcesAccess.userId, userId)
      )
    ).limit(1))[0]
    if(!userAccess){
      res.status(404).json({error: "User with access not found"})
      return
    }
    res.json(ResourceAccessSchema.parse(userAccess))
  } catch {
    res.status(400).json({error: "Invalid user id"})
    return
  }
})

resourceAccessRouter.post('/:userId', async(req, res) => {
  try {
    const userId = z.string().parse(req.params.userId)
    if(userId === req.resourceGroup!.ownerId) {
      res.status(400).json({error: "You can not add owner access"})
      return;
    }
    const userAccessData = CreateResourceGroupAccessSchema.parse(req.body)
    // only owner should be able to add manageAccess permissions
    if(req.resourceAccess && userAccessData.manageAccess){
      res.status(401).json({error: "You can not set manageAccess permissions for other users. Only owner can do that."})
      return
    }
    await db.insert(resourcesAccess).values({
      userId,
      groupId: req.resourceGroup!.id,
      create: userAccessData.create,
      update: userAccessData.update,
      delete: userAccessData.delete,
      manageAccess: userAccessData.manageAccess,
      reserveLevel: userAccessData.reserveLevel,
    })
    res.status(201).send()
  } catch {
    res.status(409).json({error: "User already has access to this resource group"})
    return
  }
})

resourceAccessRouter.put('/:userId', async(req, res) => {
  try {
    if(req.resourceAccess && !req.resourceAccess.manageAccess){
      res.status(401).json({error: "You can not edit permissions of other users"})
      return
    }
    const userId = z.string().parse(req.params.userId)
    const userAccessData = CreateResourceGroupAccessSchema.parse(req.body)
    // only owner should be able to add manageAccess permissions
    if(req.resourceAccess && userAccessData.manageAccess){
      res.status(401).json({error: "You can not set manageAccess permissions for other users. Only owner can do that."})
      return
    }
    const [result] = await db.update(resourcesAccess).set({
      create: userAccessData.create,
      update: userAccessData.update,
      delete: userAccessData.delete,
      manageAccess: userAccessData.manageAccess,
      reserveLevel: userAccessData.reserveLevel,
    }).where(
      and(
        eq(resourcesAccess.userId, userId),
        eq(resourcesAccess.groupId, req.resourceGroup!.id),
      )
    )
    if(result.affectedRows === 0){
      res.status(404).json({error: "User does not have access to this resource group"})
      return
    }
    res.status(200).send()
  } catch {
    res.status(400).json({error: "Failed to get access to update"})
    return
  }
})

resourceAccessRouter.delete('/:userId', async(req, res)=>{
  try{
    if(req.resourceAccess && !req.resourceAccess.manageAccess){
      res.status(401).json({error: "You can not remove permissions from other users"})
      return
    }
    const userId = z.string().parse(req.params.userId)
    const [result] = await db.delete(resourcesAccess).where(
      and(
        eq(resourcesAccess.userId, userId),
        eq(resourcesAccess.groupId, req.resourceGroup!.id),
        req.resourceAccess ? eq(resourcesAccess.manageAccess, false) : undefined
      )
    )
    if(result.affectedRows === 0){
      res.status(404).json({error: "User does not have access or he has same permissions as you"})
      return
    }
    res.status(200).send()
  } catch {
    res.status(400).json({error: "Failed to get access to update"})
    return
  }
})

export default resourceAccessRouter;