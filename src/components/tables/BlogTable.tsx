'use client'

import { useMemo } from 'react'

import Link from 'next/link'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { createColumnHelper } from '@tanstack/react-table'
import { toast } from 'react-toastify'

import { blogsApi } from '@/api/blogs'
import ListTable from '@components/ListTable'

export interface BlogType {
  _id: string
  title: string
  description: string
  image: string
  createdFrom: string
  createdAt: string
  updatedAt: string
}

const BlogTable = () => {
  const queryClient = useQueryClient()

  // Query for fetching blogs
  const { data = [], isError } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogsApi.listAll
  })

  // Mutation for deleting blogs
  const deleteMutation = useMutation({
    mutationFn: blogsApi.delete,
    onSuccess: () => {
      // Invalidate and refetch blogs after deletion
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      toast.success('Blog deleted successfully!')
    },
    onError: error => {
      console.error('Error deleting blog:', error)
      toast.error('Failed to delete blog')
    }
  })

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id)
  }

  const columnHelper = createColumnHelper<BlogType>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Title',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.title}
          </Typography>
        )
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.description}
          </Typography>
        )
      }),
      columnHelper.accessor('image', {
        header: 'Image',
        cell: ({ row }) => (
          <img
            src={`${row.original.image}`}
            alt={row.original.title}
            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }}
          />
        )
      }),
      columnHelper.accessor('createdFrom', {
        header: 'Created From',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).format(new Date(row.original.createdFrom))}
          </Typography>
        )
      }),
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <IconButton onClick={() => handleDelete(row.original._id)} disabled={deleteMutation.isPending}>
              <i className='tabler-trash text-textSecondary' />
            </IconButton>
            <IconButton>
              <Link href={`/blogs/edit/${row.original._id}`} className='flex'>
                <i className='tabler-pencil text-textSecondary' />
              </Link>
            </IconButton>
          </div>
        )
      }
    ],
    [deleteMutation.isPending]
  )

  if (isError) {
    return (
      <Typography color='error' className='p-4'>
        Error loading blogs. Please try again later.
      </Typography>
    )
  }

  return (
    <ListTable
      data={data}
      columns={columns}
      onDelete={handleDelete}
      createButtonProps={{
        href: '/blogs/add',
        text: 'Create Blog'
      }}
      searchPlaceholder='Search Blogs'
      initialPageSize={25}
    />
  )
}

export default BlogTable
