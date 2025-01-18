'use client'

import { useMemo } from 'react'

import Link from 'next/link'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { createColumnHelper } from '@tanstack/react-table'
import { toast } from 'react-toastify'

import { downloadsApi } from '@/api/downloads'
import ListTable from '@components/ListTable'

export interface DownloadType {
  _id: string
  title: string
  description: string
  pdfAttachment: string
  createdAt: string
  updatedAt: string
}

const DownloadsTable = () => {
  const queryClient = useQueryClient()

  // Query for fetching downloads
  const {
    data = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['downloads'],
    queryFn: downloadsApi.listAll
  })

  // Mutation for deleting downloads
  const deleteMutation = useMutation({
    mutationFn: downloadsApi.delete,
    onSuccess: () => {
      // Invalidate and refetch downloads after deletion
      queryClient.invalidateQueries({ queryKey: ['downloads'] })
      toast.success('Download deleted successfully!')
    },
    onError: error => {
      console.error('Error deleting download:', error)
      toast.error('Failed to delete download')
    }
  })

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id)
  }

  const columnHelper = createColumnHelper<DownloadType>()

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
      columnHelper.accessor('pdfAttachment', {
        header: 'File',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <IconButton component='a' href={`/${row.original.pdfAttachment}`} target='_blank' className='text-primary'>
              <i className='tabler-download' />
            </IconButton>
            <Typography className='font-medium' color='text.primary'>
              Download The PDF
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).format(new Date(row.original.createdAt))}
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
              <Link href={`/downloads/edit/${row.original._id}`} className='flex'>
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
        Error loading downloads. Please try again later.
      </Typography>
    )
  }

  return (
    <ListTable
      data={data}
      columns={columns}
      onDelete={handleDelete}
      createButtonProps={{
        href: '/downloads/add',
        text: 'Create Download'
      }}
      searchPlaceholder='Search Downloads'
      initialPageSize={25}
    />
  )
}

export default DownloadsTable
