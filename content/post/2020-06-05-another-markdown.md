---
title: "What You Can Do with Hugo and Markdown"
date: 2020-06-05T15:04:03-04:00
draft: true
---

You are encouraged to read carefully this [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) to get a deeper understand of how to write in Markdown. 

Most of the codes in that Cheatsheet will work with Markdown in Hugo:

## Headings

You can have six levels of section headings:

# H1
## H2
### H3
#### H4
##### H5
###### H6

## Blockquotes


> What I cannot create, I do not understand. **Note** that you can use *Markdown syntax* within a blockquote.


## Lists

You can create a list, both numbered or not:

#### Ordered List

1. Buy a fridge
2. Go to Kroger
3. Pay for items

#### Unordered List

- Buy a fridge
- Go to Kroger
- Pay for items

#### Nested list

- Buy a fridge
  1. Go to Kroger
  2. Pay for items

## Shortcodes

You should also know that Hugo has many shortcodes that make writing in Markdown more powerful.

For example, you can use the following codes to add figures:


{{<figure src="http://cdn.akc.org/content/article-body-image/french_bulldog_cute_puppies.jpg" title="Title here" caption="Caption here" width="450">}}

Of course you can add figures using the codes in the above cheatsheet, but you cannot add title and caption, and it's difficult to change width and height of the figure. You can do all of these using Hugo built-in shortcodes. 

You can also embed Vimeo and YouTube videos:


{{< vimeo 146022717 >}}

and

{{< youtube id="w7Ft2ymGmfc" autoplay="true" >}}

You can also show your Instagram here:

{{< instagram BmuPJk2jX5- >}}








