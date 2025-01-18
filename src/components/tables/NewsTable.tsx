'use client'

import { useMemo } from 'react'

import Link from 'next/link'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { createColumnHelper } from '@tanstack/react-table'
import { toast } from 'react-toastify'

import { newsApi } from '@/api/news'
import ListTable from '@components/ListTable'

export interface NewsType {
  _id: string
  title: string
  description: string
  image: string
  createdFrom: string
  createdAt: string
  updatedAt: string
}

const NewsTable = () => {
  const queryClient = useQueryClient()

  // Query for fetching news
  const { data = [], isError } = useQuery({
    queryKey: ['news'],
    queryFn: newsApi.listAll
  })

  // Mutation for deleting news
  const deleteMutation = useMutation({
    mutationFn: newsApi.delete,
    onSuccess: () => {
      // Invalidate and refetch news after deletion
      queryClient.invalidateQueries({ queryKey: ['news'] })
      toast.success('News deleted successfully!')
    },
    onError: error => {
      console.error('Error deleting news:', error)
      toast.error('Failed to delete news')
    }
  })

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id)
  }

  const columnHelper = createColumnHelper<NewsType>()

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
              <Link href={`/news/edit/${row.original._id}`} className='flex'>
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
        Error loading news. Please try again later.
      </Typography>
    )
  }

  return (
    <ListTable
      data={data}
      columns={columns}
      onDelete={handleDelete}
      createButtonProps={{
        href: '/news/add',
        text: 'Create News'
      }}
      searchPlaceholder='Search News'
      initialPageSize={25}
    />
  )
}

export default NewsTable
