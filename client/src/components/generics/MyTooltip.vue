<template>
	<v-tooltip v-bind="$attrs">
		<template #activator="{ on, attrs }">
			<v-btn
				icon
				:color="color"
				dark
				v-bind="attrs"
				v-on="on"
				@click="$emit('click')"
			>
				<v-icon v-bind="$attrs">
					{{ icon }}
				</v-icon>
			</v-btn>
		</template>
		<span>{{ text }}</span>
	</v-tooltip>
</template>
<script>
export default {
  name: "MyTooltip",
  props: {
    color: { type: String, default: "grey darken-1" },
    text: String,
    icon: String,
  },
}
</script>
