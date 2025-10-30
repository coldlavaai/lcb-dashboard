import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'commentary',
  title: 'Commentary',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'chart',
      title: 'Related Chart',
      type: 'string',
      options: {
        list: [
          {title: 'CZCE - ICE', value: 'CZCE-ICE'},
          {title: 'MCX - ICE', value: 'MCX-ICE'},
          {title: 'AWP - ICE', value: 'AWP-ICE'},
          {title: 'CZCE Cotton - PSF', value: 'CZCE-PSF'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Harry Bennett',
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key Points',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'chart',
    },
  },
})
