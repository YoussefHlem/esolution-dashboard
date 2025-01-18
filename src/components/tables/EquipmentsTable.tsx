'use client'

import { useMemo } from 'react'

import Link from 'next/link'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { createColumnHelper } from '@tanstack/react-table'
import { toast } from 'react-toastify'

import { equipmentsApi } from '@/api/equipments'
import ListTable from '@components/ListTable'

export interface EquipmentType {
  _id: string
  title: string
  description: string
  image: string
  qty: number
  createdAt: string
}

const EquipmentsTable = () => {
  const queryClient = useQueryClient()

  const { data = [], isError } = useQuery({
    queryKey: ['equipments'],
    queryFn: equipmentsApi.listAll
  })

  const deleteMutation = useMutation({
    mutationFn: equipmentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipments'] })
      toast.success('Equipment deleted successfully!')
    },
    onError: error => {
      console.error('Error deleting equipment:', error)
      toast.error('Failed to delete equipment')
    }
  })

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id)
  }

  const columnHelper = createColumnHelper<EquipmentType>()

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
      columnHelper.accessor('qty', {
        header: 'Quantity',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.qty}
          </Typography>
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
              <Link href={`/equipments/edit/${row.original._id}`} className='flex'>
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
        Error loading equipments. Please try again later.
      </Typography>
    )
  }

  return (
    <ListTable
      data={data}
      columns={columns}
      onDelete={handleDelete}
      createButtonProps={{
        href: '/equipments/add',
        text: 'Add Equipment'
      }}
      searchPlaceholder='Search Equipments'
      initialPageSize={25}
    />
  )
}

export default EquipmentsTable
