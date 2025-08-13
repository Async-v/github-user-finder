let form = document.querySelector(".form")
let usernameinp = document.querySelector(".usernameinp")
let card = document.querySelector(".card")
let repos = document.querySelector(".repos")

function getUserProfile(username){
    return fetch(`https://api.github.com/users/${username}`).then(raw => {
        if(!raw.ok) throw new Error("User not found.");
        return raw.json();
    })
}

function getRepos(username){
    return fetch(`https://api.github.com/users/${username}/repos?sort=created&direction=desc&per_page=4`).then(raw => {
        if(!raw.ok) throw new Error("Failed to fetch repos...");
            return raw.json();
    })
}

function decorateProfileData(details){
    let date = details.created_at
    let data = `<img 
        src="${details.avatar_url}" 
        alt="GitHub Profile Picture" 
        class="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
      />
      <div class="flex-1">
        <h2 class="text-2xl font-bold">${details.name}</h2>
        <p class="text-gray-400">@${details.login}</p>
        <p class="mt-3 text-gray-300">${details.bio ? details.bio : "Sorry there is no bio..."}</p>

        <div class="grid grid-cols-3 gap-6 mt-5 text-gray-300">
          <div class="text-center">
            <span class="block text-lg font-bold">${details.public_repos}</span>
            <span class="text-sm text-gray-500">Repos</span>
          </div>
          <div class="text-center">
            <span class="block text-lg font-bold">${details.followers}</span>
            <span class="text-sm text-gray-500">Followers</span>
          </div>
          <div class="text-center">
            <span class="block text-lg font-bold">${details.following}</span>
            <span class="text-sm text-gray-500">Following</span>
          </div>
        </div>

        <div class="mt-6 space-y-2 text-gray-400 text-sm">
          <p><span class="font-semibold text-white">Company:</span> ${details.company ? details.company : "N/A"}</p>
          <p><span class="font-semibold text-white">Location:</span> ${details.location}</p>
          <p><span class="font-semibold text-white">Website:</span> <a href="https://github.com/${details.login}" class="text-blue-400 hover:underline">https://github.com/${details.login}</a></p>
          <p><span class="font-semibold text-white">Member Since:</span> ${date.split("T")[0]}</p>
        </div>

        <a 
          href="${details.html_url}" 
          target="_blank" 
          class="inline-block mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
        >
          View on GitHub
        </a>
      </div>`

    card.innerHTML = data
}

function latestRepo(repo){
  repos.innerHTML = `<h3 class="text-xl font-semibold mb-4">Latest Repositories</h3>`
  repo.forEach(elem => {
    let date = elem.updated_at
    let repo = `
    <div class="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition">
    <a href="${elem.html_url}" class="text-blue-400 font-semibold text-lg hover:underline">${elem.name}</a>
    <p class="text-gray-400 text-sm mt-1">${elem.description ? elem.description : "Sorry there is no desp..."}</p>
    <div class="flex gap-4 mt-2 text-sm text-gray-500">
    <span>⭐ ${elem.stargazers_count}</span>
    <span>🍴 ${elem.forks_count}</span>
    <span>Updated: ${date.split("T")[0]}</span>
    </div>
    </div>
    `
    repos.innerHTML += repo
  });
}

form.addEventListener("click", function(e){
    e.preventDefault();
    let username = usernameinp.value.trim()
    if(username.length > 0){
        getUserProfile(username).then(data =>{
            decorateProfileData(data)
        })

        getRepos(username).then(data =>{
          latestRepo(data)
        })
    }
})
