import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string | null;
  description: string | null;
  enrollmentCount: number;
  price: number;
  category: string;
}

const CourseCard = ({ id, title, imageUrl, description, enrollmentCount, price, category }: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <Card className="group hover:shadow-lg transition-all overflow-hidden">
        <div className="relative aspect-video w-full">
          {imageUrl ? (
            <Image src={imageUrl} alt={title} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <BookOpen className="h-12 w-12 text-slate-400" />
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md">
            <p className="text-white text-sm font-medium">${price.toFixed(2)}</p>
          </div>
        </div>

        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="text-sm px-2 py-1 bg-slate-100 rounded-full">{category}</span>
            <div className="flex items-center text-slate-600 text-sm">
              <Users className="h-4 w-4 mr-1" />
              {enrollmentCount}
            </div>
          </div>
          <h3 className="font-semibold text-lg mt-2 line-clamp-1">{title}</h3>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
