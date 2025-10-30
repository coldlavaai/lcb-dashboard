import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cottonPrice',
  title: 'Cotton Price',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'market',
      title: 'Market',
      type: 'string',
      options: {
        list: [
          {title: 'CZCE (China)', value: 'CZCE'},
          {title: 'MCX (India)', value: 'MCX'},
          {title: 'ICE (US)', value: 'ICE'},
          {title: 'Pakistan', value: 'Pakistan'},
          {title: 'Brazil (CEPEA)', value: 'Brazil'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'spread',
      title: 'Spread',
      type: 'string',
      options: {
        list: [
          {title: 'CZCE - ICE', value: 'CZCE-ICE'},
          {title: 'MCX - ICE', value: 'MCX-ICE'},
          {title: 'AWP - ICE', value: 'AWP-ICE'},
          {title: 'CZCE Cotton - PSF', value: 'CZCE-PSF'},
        ],
      },
    }),
    defineField({
      name: 'spreadValue',
      title: 'Spread Value',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'market',
      subtitle: 'date',
    },
  },
})
