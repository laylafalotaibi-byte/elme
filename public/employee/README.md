# Employee photo

Drop the approved photo of the story's employee here (e.g. `story01.jpg`) and set it in
`src/stories/story01/story.config.ts`:

```ts
employee: {
  name: 'Approved Name',          // null → the final film shows the role only
  title: 'IT Support',
  team: null,
  photo: 'employee/story01.jpg',  // null → the back-lit silhouette placeholder
  focalPoint: { x: 0.38, y: 0.4 } // where his face is (0…1); keeps it framed in every crop
}
```

**Photo spec:** landscape, ≥ 3840 px wide, taken at his own desk in window light, looking at
his screen (not the lens), with clear negative space on the right for type. No stock imagery.
The film applies its own documentary treatment (monochrome base that warms and brightens with
the story's light arc), so supply an ungraded photo.

`__lab_test_photo.jpg` is an abstract placeholder (not a person) used only by the
`Lab-Photo` composition to check the photo path end-to-end.
