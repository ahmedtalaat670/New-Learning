import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { PaginationQueryDto } from '../dtos/pagination.dto';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable({
  scope: Scope.REQUEST,
})
export class PaginationService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}
  public async paginate<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repository: Repository<T>,
    options?: {
      where: FindOptionsWhere<T>;
    },
    relations?: FindOptionsRelations<T>,
  ): Promise<Paginated<T>> {
    const limit: number = paginationQueryDto.limit ?? 10;
    const page: number = paginationQueryDto.page ?? 1;
    const [result, totalItems] = await repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        ...this.getFilters<T>(),
        ...(options?.where ?? {}),
      },
      order: this.getSort<T>(),
      ...(relations ? { relations } : {}),
    });
    const baseUrl =
      this.request.protocol +
      '://' +
      this.request.get('host') +
      this.request.path;

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const nextPage = page < totalPages ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;

    const finalResult = {
      data: result,
      meta: {
        itemsPerPage: limit,
        totalItems,
        currentPage: page,
        totalPages,
      },
      links: {
        first: this.createPageLink(1, limit, baseUrl),
        previous: previousPage
          ? this.createPageLink(previousPage, limit, baseUrl)
          : null,
        current: this.createPageLink(page, limit, baseUrl),
        next: nextPage ? this.createPageLink(nextPage, limit, baseUrl) : null,
        last: this.createPageLink(totalPages, limit, baseUrl),
      },
    };
    return finalResult;
  }

  private createPageLink(page: number, limit: number, baseUrl: string): string {
    const queryParams = new URLSearchParams();
    Object.entries(this.request.query).forEach(([key, value]) => {
      if (key === 'page' || key === 'limit') return;
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (typeof v === 'string') queryParams.append(key, v);
        });
      } else if (typeof value === 'string') queryParams.set(key, value);
    });
    queryParams.set('page', page.toString());
    queryParams.set('limit', limit.toString());
    return `${baseUrl}?${queryParams}`;
  }

  private getFilters<T extends ObjectLiteral>(): FindOptionsWhere<T> {
    const excludedSearchQuery = ['limit', 'page', 'sort'];
    const filters: FindOptionsWhere<T> = {};
    Object.entries(this.request.query).forEach(([key, value]) => {
      if (excludedSearchQuery.includes(key)) return;
      else if (Array.isArray(value))
        filters[key as keyof T] = In(value) as never;
      else if (typeof value === 'string')
        filters[key as keyof T] = value as never;
    });
    return filters;
  }

  private getSort<T extends ObjectLiteral>(): FindOptionsOrder<T> {
    const sort = this.request.query.sort as string;
    if (!sort) return {};
    const [field, direction] = sort.split(':');
    return {
      [field as keyof T]: direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
    } as FindOptionsOrder<T>;
  }
}
