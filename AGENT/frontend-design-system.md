# frontend-design-system.md

# Design Philosophy

Create a modern, premium, lightweight catalog website.

The design must feel:

* Clean
* Fast
* Professional
* Trustworthy
* Mobile-first
* Minimal but not empty

Avoid visual clutter.

Avoid excessive animations.

Avoid dark mode initially.

Prioritize readability and conversion.

The primary action throughout the website is:

```text
Contact via WhatsApp
```

---

# Design Direction

Visual Style:

* Modern Ecommerce
* Apple-inspired spacing
* Shopify-inspired cards
* Soft shadows
* Rounded corners
* Light backgrounds

The interface should feel premium even for a small local business.

---

# Color Palette

## Background

```css
#ffffff
```

Main page background

---

## Secondary Background

```css
#f8fafc
```

Section backgrounds

Cards

Filters

Forms

---

## Border Color

```css
#e5e7eb
```

---

## Main Text

```css
#111827
```

---

## Secondary Text

```css
#6b7280
```

---

## Success / WhatsApp

```css
#25D366
```

---

## Primary Accent

```css
#2563eb
```

---

## Hover Accent

```css
#1d4ed8
```

---

# Typography

Font Family:

```css
"Cairo", sans-serif
```

Fallback:

```css
sans-serif
```

---

# Font Weights

```text
400 Regular

500 Medium

600 SemiBold

700 Bold
```

---

# Border Radius

Cards

```css
16px
```

---

Buttons

```css
12px
```

---

Inputs

```css
12px
```

---

Images

```css
16px
```

---

# Shadow System

Cards

```css
0 4px 20px rgba(0,0,0,.05)
```

---

Hover

```css
0 8px 30px rgba(0,0,0,.08)
```

---

# Layout Rules

Container Width

```css
1200px
```

---

Section Spacing

Desktop

```css
100px
```

Top and bottom

---

Tablet

```css
80px
```

---

Mobile

```css
60px
```

---

# Navbar

Sticky

White Background

Small Border Bottom

---

Contains:

* Logo
* Categories
* Products
* WhatsApp Button

---

Desktop Height

```css
80px
```

---

Mobile Height

```css
70px
```

---

# Hero Section

Large visual section

Contains:

* Slider
* Promotion Banner
* CTA

---

Height

Desktop

```css
550px
```

---

Tablet

```css
450px
```

---

Mobile

```css
300px
```

---

Slider Images

Must support:

```text
Product

Category

External Link
```

---

# Categories Section

Grid Layout

Desktop

```text
4 columns
```

---

Tablet

```text
3 columns
```

---

Mobile

```text
2 columns
```

---

Category Card

Contains:

* Image
* Name

---

Hover:

```text
scale 1.03
```

maximum

No aggressive animation.

---

# Featured Products

Use Product Cards.

Desktop

```text
4 columns
```

---

Tablet

```text
2 columns
```

---

Mobile

```text
1 column
```

---

# Product Card

Contains:

* Image
* Name
* Price
* Sale Price
* Offer Badge
* Stock Badge
* WhatsApp Button

---

Card Height

Consistent.

Avoid jumping layouts.

---

Product Image Ratio

```css
1 / 1
```

Square

---

Image Fit

```css
object-fit: cover;
```

---

# Product Details Page

Layout

Desktop

```text
Left:
Gallery

Right:
Information
```

---

Mobile

```text
Gallery

Information
```

Stacked

---

Contains

* Product Gallery
* Product Name
* Price
* Description
* Colors
* Sizes
* Offer Countdown
* WhatsApp CTA

---

# Offer Countdown

Only show when:

```text
show_offer_timer = true
```

---

Style

Small

Clean

Non-intrusive

---

Avoid fake urgency styling.

---

# Search Bar

Width

Desktop

```css
500px
```

---

Rounded

Search icon

Instant filtering

---

# Filters

Use:

```text
Accordion
```

on mobile

---

Sidebar

on desktop

---

Filters:

* Categories
* Featured
* Offers

---

# WhatsApp Button

Primary conversion button.

Color:

```css
#25D366
```

---

Hover

```css
brightness(95%)
```

---

Floating WhatsApp

Bottom Right

Desktop and Mobile

---

Size

```css
60px
```

---

# Footer

Contains:

* Logo
* Categories
* Social Links
* WhatsApp
* Copyright

---

Background

```css
#111827
```

---

Text

```css
#ffffff
```

---

# Dashboard Design

Separate visual identity.

---

Sidebar

```css
280px
```

Desktop

---

Collapsed on mobile.

---

Dashboard Colors

```css
#ffffff

#f8fafc

#111827
```

---

Avoid dark admin panels.

---

# Dashboard Tables

Use:

Bootstrap Table

Responsive Table

---

Columns

Products

Categories

Slider

Settings

---

Actions

```text
Edit

Delete
```

always on right side.

---

# Forms

Use Bootstrap Forms.

---

Input Height

```css
48px
```

---

Textarea

```css
min-height: 120px;
```

---

Image Upload

Preview immediately.

---

Drag & Drop preferred.

---

# Empty States

Always show:

* Icon
* Message
* Action Button

Example:

```text
No Products Yet

Add Your First Product
```

---

# Loading States

Use Skeletons.

Avoid spinners for page content.

---

Use Skeleton Cards for:

* Products
* Categories
* Hero Slider

---

# Responsive Rules

Breakpoints

```css
576px
768px
992px
1200px
```

---

Mobile First

Always design mobile before desktop.

---

# Accessibility

Every image:

```html
alt=""
```

must exist.

---

Buttons:

Proper labels.

---

Forms:

Proper labels.

---

Keyboard navigation must work.

---

# Final Goal

The UI should feel like a lightweight Shopify storefront:

Modern

Fast

Professional

Trustworthy

Easy to browse

Easy to manage

Focused entirely on converting visitors into WhatsApp conversations.
