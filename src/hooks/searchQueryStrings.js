export let searchAnimeQuery = `
	query($search: String) {
		Page(page: 1, perPage: 100) {
			media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
				idMal
				title {
					romaji
					english
					native
					userPreferred
				}
				genres
				bannerImage
				coverImage {
					extraLarge
					large
				}
			}
		}
	}
`;

export let searchByIdQuery = `
	query($id: Int) {
		Media(idMal: $id, type: ANIME){
			title {
				romaji
				english
				native
				userPreferred
			}
			type
			status
			genres
			description
			startDate {
				year
				month
				day
			}
			endDate {
				year
				month
				day
			}
			averageScore
			bannerImage
			coverImage {
				extraLarge
				large
			}
		}
	}
`;

export let searchWatchedId = `
	query($ids: [Int]) {
		Page(page: 1, perPage: 100) {
			media(idMal_in: $ids, type: ANIME, sort: SEARCH_MATCH){
				title {
					romaji
					userPreferred
					english
				}
				coverImage {
					large
					extraLarge
				}
				idMal
			}
		}
	}
`;

export let searchByAniIdQuery = `
	query($id: Int) {
		Media(id: $id){
			title {
				romaji
				english
				native
				userPreferred
			}
			type
			status
			genres
			description
			startDate {
				year
				month
				day
			}
			endDate {
				year
				month
				day
			}
			averageScore
			bannerImage
			coverImage {
				extraLarge
				large
			}
		}
	}
`;
