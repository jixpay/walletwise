import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CartsService {
    constructor(private readonly prisma:PrismaService){}

    async cart_exist(query:Object):Promise<Boolean>{
        const res = await this.prisma.prismaClient.cart.findFirst({where:query})
        if(res) return true
        return false
    }

    async create_cart(data):Promise<Cart>{
        try {
            if(await this.prisma.prismaClient.cart.findFirst({where:{name:data.name}})) throw new BadRequestException('CART NAME IS ALREADY USED!')
            return await this.prisma.prismaClient.cart.create({data})
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async fetch_carts(query:Object):Promise<Cart[]>{
        try {
            return await this.prisma.prismaClient.cart.findMany({where:query})
        } catch (error) {
            throw new BadRequestException('There was an ERROR occured fetching your carts')
        }
    }

    async fetch_cart(id: number):Promise<Cart>{
        try {
            if(!await this.cart_exist({id})) throw new NotFoundException('The cart no longer exist!')
            return await this.prisma.prismaClient.cart.findFirst({where:{id}})
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async update_cart(id: number, data): Promise<Cart>{
        try {
            if(!await this.cart_exist({id})) throw new NotFoundException('The cart no longer exist!')
            return await this.prisma.prismaClient.cart.update({where:{id}, data})
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async delete_cart(id: number): Promise<Cart>{
        try {
            if(!await this.cart_exist({id})) throw new NotFoundException('The cart no longer exist!')
            await this.prisma.prismaClient.cartProduct.deleteMany({where:{cart_id:id}})
            return await this.prisma.prismaClient.cart.delete({where:{id}})
        } catch (error) {
            throw new BadRequestException('There was an ERROR deleting the cart')
        }
    }
}
