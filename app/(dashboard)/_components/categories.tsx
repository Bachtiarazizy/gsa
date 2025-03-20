"use client";

import { Category } from "@prisma/client";
import React from "react";
import { Upload, Globe, DollarSign } from "lucide-react";
import { LucideIcon } from "lucide-react";
import CategoryItem from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const IconMap: Record<Category["name"], LucideIcon> = {
  "Ekspor & impor": Upload,
  "Digital Marketing": Globe,
  Investment: DollarSign,
};

const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto bg-primary-secondary md:rounded-tl-3xl md:rounded-bl-xl container mx-auto">
      {items.map((item) => (
        <CategoryItem key={item.id} label={item.name} value={item.id} icon={IconMap[item.name]} />
      ))}
    </div>
  );
};

export default Categories;
