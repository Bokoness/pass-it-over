import _ from "lodash";
const SubmitMixin = {
	data () {
		return {
			// emailRules: [
			// 	v => !!v || this.$t("notEmpty"),
			// ],
			// // checkboxRules: [
			// // 	v => !!v || this.$t("notEmpty"),
			// // ],
			// multiCheckboxRules: [
			// 	v => !!v || this.$t("notEmpty"),
			// ],
			// noEmpty: [
			// 	v => !!v || this.$t("notEmpty"),
			// ],
			// model: null,
		};
	},
	computed: {
		question () {
			return this.$store.state.QuestionModule.question;
		},
		game () {
			return this.$store.state.GameModule.game;
		},
	},
	methods: {
		onSubmit: _.debounce(function (action, payload) {
			this.$store.dispatch(action, payload);
		}, 1500),
		validationGame () {

		},
		validationQuestion () {

		},
		saveQuestion () {
			// if (!this.validationGame(this.question)) return;
			this.onSubmit("question/update", this.question);
		},
		saveGame () {
			// if (!this.validationGame(this.game)) return;
			this.onSubmit("game/update", this.game);
		},
	},
};

export default SubmitMixin;
