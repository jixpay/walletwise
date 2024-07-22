import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Store } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class StoresService {
    constructor(private readonly prisma:PrismaService){}

    async store_exist(query:Object):Promise<Boolean>{
        const res = await this.prisma.prismaClient.store.findFirst({where:query})
        if(res) return true
        return false
    }

    async create_store(data): Promise<Store>{
        try {
            if(await this.prisma.prismaClient.store.findFirst({where:{name:data.name}})) throw new BadRequestException('STORE NAME IS ALREADY USED, ')
            return await this.prisma.prismaClient.store.create({data})
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async fetch_stores(query:Object): Promise<Store[]>{
        const res = await this.prisma.prismaClient.store.findMany({where:query})
        if(!res) throw new BadRequestException('An ERROR occured fetching stores')
        return res
    }

    async fetch_store(id: number): Promise<Store>{
        const res = await this.prisma.prismaClient.store.findFirst({where:{id}})
        if(!res) throw new NotFoundException('An ERROR fetching the store information')
        return res
    }

    async update_store(id: number, data):Promise<Store>{
        try {
            return await this.prisma.prismaClient.store.update({where:{id}, data})
        } catch (error) {
            console.log(error.message)
            throw new BadRequestException('An ERROR occur updating the store')
        }
    }

    async delete_store(id: number): Promise<Store>{
        try {
            const products = await this.prisma.prismaClient.product.findMany({ where: { store_id:id }})
            const promises = products.map(async (product) => {
                await this.prisma.prismaClient.cartProduct.deleteMany({where:{product_id:product.id}})
                await this.prisma.prismaClient.orderProduct.deleteMany({where:{product_id:product.id}})
            });
            await Promise.all(promises);
            await this.prisma.prismaClient.product.deleteMany({where:{store_id:id}})
            return await this.prisma.prismaClient.store.delete({where:{id}})
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
