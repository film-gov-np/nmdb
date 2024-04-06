import { Paths } from '@/constants/routePaths'
import { cn } from '@/lib/utils'
import { PlusCircle } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { buttonVariants } from '../ui/button'

const NoDataComponent = ({label, pathTo}) => {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no {label}
              </h3>
  
              <p className="text-sm text-muted-foreground">
                You can start managing as soon as you add a {label}.
              </p>
              <NavLink
                to={pathTo}
                className={cn(buttonVariants({ variant: "default" }), "mt-4 capitalize ")}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add {label}
              </NavLink>
            </div>
          </div>
  )
}

export default NoDataComponent