import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CartProduct } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CartproductsService {
    constructor(private readonly prisma:PrismaService){}

    async is_owner(product_id: number, user_id: number): Promise<boolean>{
        try {
            const product = await this.prisma.prismaClient.product.findFirst({where:{id:product_id}})
            const store = await this.prisma.prismaClient.store.findFirst({where:{id: product.store_id}})
            if(user_id === store.user_id) return true
            return false
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async cartproduct_exist(query:Object): Promise<Boolean>{
        const res = await this.prisma.prismaClient.cartProduct.findFirst({where:query})
        if(res) return true
        return false
    }

    async create_cartproduct(data: any, user_id: number):Promise<CartProduct>{
        try {
            const cart = await this.prisma.prismaClient.cart.findFirst({where:{id:data.cart_id}})
            if(!cart) throw new BadRequestException('The cart do not exist')
            const product = await this.prisma.prismaClient.product.findFirst({where:{id:data.product_id}})
            if(!product) throw new BadRequestException('The product do not exist')
            const store = await this.prisma.prismaClient.store.findFirst({where:{id:product.store_id}})

            console.log(store, user_id)

            if(store.user_id === user_id) throw new ForbiddenException('You are not AUTHORIZED to add this product to a cart.')
            return this.prisma.prismaClient.cartProduct.create({data})
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async fetch_cartproducts(query:Object):Promise<CartProduct[]>{
        try {
            return this.prisma.prismaClient.cartProduct.findMany({where:query})
        } catch (error) {
            throw new BadRequestException('There was an ERROR fetching cart products')
        }
    }

    async fetch_cartproduct(query:Object):Promise<CartProduct>{
        try {
            return this.prisma.prismaClient.cartProduct.findFirst({where:query})
        } catch (error) {
            throw new BadRequestException('There was an ERROR fetching cart product')
        }
    }

    async update_cartproduct(id: number, data): Promise<CartProduct>{
        try {
            if(data.quantity < 1) throw new BadRequestException('Quantity should not be ZERO')
            return this.prisma.prismaClient.cartProduct.update({where:{id}, data})
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async delete_cartproduct(id: number): Promise<CartProduct>{
        try {
            return this.prisma.prismaClient.cartProduct.delete({where:{id}})
        } catch (error) {
            throw new BadRequestException('There was an ERROR deleting the cart product')
        }
    }
}
