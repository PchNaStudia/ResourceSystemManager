import { Router } from 'express';
import db, {resource, resourceType} from "@server/db";
import {and, eq, inArray} from "drizzle-orm";
import {CreateResourceSchema, ResourceSchema, ResourceSchemaList, UpdateResourceSchema} from "@common/ApiTypes";
import {z} from "zod";

const resourceRouter = Router();

const typeExists = async(typeId: number, groupId: number) => ((await db.select().from(resourceType).where(
  and(
    eq(resourceType.groupId, groupId),
    eq(resourceType.id, typeId)
  )
).limit(1)).length > 0);

resourceRouter.get('/', async(req, res) => {
  // resourceAccess will be null for an owner only, people with no access at all will be rejected earlier by middleware
  // if resource access is created it implicitly grants read permission
    try {
      const resources = await db.select().from(resource).where(eq(resource.groupId, req.resourceGroup!.id))
      try {
        res.json(ResourceSchemaList.parse(resources))
      } catch {
        res.status(400).json({error: "Could not parse resources"})
      }
    } catch {
      res.status(404).json({error: "Could not get resources"})
    }
});

resourceRouter.get('/:id', async(req, res) => {
  try {
    const resourceId = z.coerce.number().parse(req.params.id)
    const resources = (await db.select().from(resource).where(
      and(
        eq(resource.groupId, req.resourceGroup!.id),
        eq(resource.id, resourceId)
      )
    ).limit(1))[0]
    try {
      res.json(ResourceSchema.parse(resources))
    } catch {
      res.status(400).json({error: "Could not parse resources"})
    }
  } catch {
    res.status(404).json({error: "Could not get resources"})
  }
});

const getDescendingTypes = async(typeId: number[]): Promise<number[]> => {
  let queue = typeId
  while(queue.length > 0){
    queue = (await db.select({id:resourceType.id}).from(resourceType).where(
      inArray(resourceType.parentId, queue)
    )).map(x => x.id)
    typeId = [...typeId, ...queue]
  }
  return typeId;
}

resourceRouter.get('/type/:type', async(req, res) => {
  try {
    const resourceTypeId = z.coerce.number().parse(req.params.type)
    if(!await typeExists(resourceTypeId, req.resourceGroup!.id)){
      res.status(404).json({error: "Resource type not found"})
      return;
    }
    const types = await getDescendingTypes([resourceTypeId])
    const resources = (await db.select().from(resource).where(
      and(
        eq(resource.groupId, req.resourceGroup!.id),
        inArray(resource.typeId, types),
      )
    ))
    try {
      res.json(ResourceSchemaList.parse(resources))
    } catch {
      res.status(400).json({error: "Could not parse resources"})
    }
  } catch {
    res.status(404).json({error: "Could not get resources"})
  }
});

resourceRouter.post('/', async(req, res) => {
  // resourceAccess will be null for an owner only, people with no access at all will be rejected earlier by middleware
  if(req.resourceAccess && !req.resourceAccess.create){
    res.status(401).json({error: "You do not have permission to create resources"})
    return;
  }
  try {
    const resourceData = CreateResourceSchema.parse(req.body)
    if(!await typeExists(resourceData.typeId, req.resourceGroup!.id)) {
      res.status(404).json({error: "Resource type not found"})
      return;
    }
    const id = await db.insert(resource).values({
      groupId: req.resourceGroup!.id,
      label: resourceData.label,
      typeId: resourceData.typeId,
      metadata: resourceData.metadata,
    }).$returningId()
    if(!id[0]) {
      res.status(400).json({error: "Could not create resource"})
      return
    }
    res.json(id[0])
  } catch {
    res.status(404).json({error: "Could not get resources"})
  }
});

resourceRouter.put('/:id', async(req, res) => {
  if(req.resourceAccess && !req.resourceAccess.update){
    res.status(401).json({error: "You do not have permission to create resources"})
    return;
  }
  try {
    const resourceId = z.coerce.number().parse(req.params.id)
    const resourceData = UpdateResourceSchema.parse(req.body)
    if(resourceData.typeId && !await typeExists(resourceData.typeId, req.resourceGroup!.id)){
      res.status(404).json({error: "Resource type not found"})
      return;
    }
    await db.update(resource).set({
      label: resourceData.label,
      typeId: resourceData.typeId,
      metadata: resourceData.metadata,
    }).where(
      and(
        eq(resource.id, resourceId),
        eq(resource.groupId, req.resourceGroup!.id)
      )
    )
    res.status(200).send()
  } catch {
    res.status(404).json({error: "Could not get resources"})
  }
});

resourceRouter.put('/bulk/:inType/:outType', async(req, res) => {
  if(req.resourceAccess && !req.resourceAccess.update){
    res.status(401).json({error: "You do not have permission to create resources"})
    return;
  }
  try {
    const inTypeId = z.coerce.number().parse(req.params.inType)
    const outTypeId = z.coerce.number().parse(req.params.outType)
    if(!await typeExists(inTypeId, req.resourceGroup!.id)){
      res.status(404).json({error: "Input Resource type not found"})
      return;
    }
    if(!await typeExists(outTypeId, req.resourceGroup!.id)){
      res.status(404).json({error: "Output Resource type not found"})
      return;
    }
    await db.update(resource).set({
      typeId: outTypeId,
    }).where(
      and(
        eq(resource.typeId, inTypeId),
        eq(resource.groupId, req.resourceGroup!.id)
      )
    )
    res.status(200).send()
  } catch {
    res.status(404).json({error: "Could not get resources"})
  }
});

resourceRouter.delete('/:id', async(req, res) => {
  if(req.resourceAccess && !req.resourceAccess.delete){
    res.status(401).json({error: "You do not have permission to create resources"})
    return;
  }
  const resourceId = z.coerce.number().parse(req.params.id)
  try {
    await db.delete(resource).where(
      and(
        eq(resource.id, resourceId),
        eq(resource.groupId, req.resourceGroup!.id)
      )
    )
    res.status(200).send()
  } catch {
    res.status(404).json({error: "Could not get resources"})
  }
});

export default resourceRouter;