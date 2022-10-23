const ApiKey = "f29621dddc7c47858ca02a7e960e2983";
const baseUrl = "https://api.football-data.org/v2/";
const leagueId = "2021";
const baseEndPoin = `${baseUrl}competitions/${leagueId}`;
const teamEndPoin = `${baseUrl}competitions/${leagueId}/teams`;
const standingEndPoin = `${baseUrl}competitions/${leagueId}/standings`;
const matchEndPoin = `${baseUrl}competitions/${leagueId}/matches`;
const contents = document.querySelector("#content-list");
const title = document.querySelector(".card-title");
const teamDetailContent = document.getElementById("team-detail-content");
const activeTeamId = null;

const fetchHeader = {
  headers: {
    "X-Auth-Token": ApiKey,
  },
};

function getListTeams() {
  title.innerHTML = "Daftar Tim Liga Primer Inggris";
  fetch(teamEndPoin, fetchHeader)
    .then((response) => response.json())
    .then((resJson) => {
      console.log(resJson.teams);
      let teams = "";
      resJson.teams.forEach((team) => {
        teams += `
                <li class="collection-item avatar">
                    <img src="${team.crestUrl}" alt="" class="circle">
                    <span class="title">${team.name}</span>
                    <p>Berdiri: ${team.founded} <br>
                       Markas: ${team.venue}
                    </p>
                    <a href="#teamDetailModal" id="${team.id}" class="secondary-content btn-team modal-trigger"><i id="${team.id}" class="material-icons">info</i></a>
                </li>
                `;
      });
      contents.innerHTML = '<ul class="collection">' + teams + "</ul>";

      document.querySelectorAll(".btn-team").forEach((item) => {
        item.addEventListener("click", function (e) {
          loadDetailTeamToModal(e.target.id);
        });
      });
    })
    .catch((err) => {
      console.error(err);
    });
}
function loadDetailTeamToModal(id) {
  teamDetailContent.innerHTML = "";
  fetch(`https://api.football-data.org/v2/teams/${id}`, fetchHeader)
    .then((res) => res.json())
    .then((result) => {
      let squadsHTML = ``;
      result.squad.forEach((squad, index) => {
        squadsHTML += `<tr>
            <td>${index + 1}</td>
            <td>${squad.name}</td>
            <td>${squad.position}</td>
            <td>${squad.nationality}</td>
            <td>${squad.countryOfBirth}</td>
            <td>${squad.role}</td>
          </tr>`;
      });
      let teamDetailContentHTML = ` <div class="row">
      <div
        class="col m3"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <div>
          <h4 style="text-align: center">${result.name}</h4>

          <img style="width:100%;" src="${result.crestUrl}" alt="" />
        </div>
      </div>
      <div class="col m9">
        <p style="font-weight: bold">Informasi Team</p>
        <table id="information-table">
          <tr>
            <td>Nama</td>
            <td>${result.name}</td>
          </tr>
          <tr>
            <td>Nama pendek</td>
            <td>${result.shortName}</td>
          </tr>
          <tr>
            <td>Alamat</td>
            <td>${result.address}</td>
          </tr>
          <tr>
            <td>Website</td>
            <td>${result.website}</td>
          </tr>
          <tr>
            <td>Markas</td>
            <td>${result.venue}</td>
          </tr>
        </table>
        <p style="font-weight: bold">Squads Team</p>
        <table>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Posisi</th>
            <th>Kebangsaan</th>
            <th>Negara tempat lahir</th>
            <th>Status</th>
          </tr>
          ${squadsHTML}
        </table>
      </div>
    </div>`;
      teamDetailContent.innerHTML = teamDetailContentHTML;
    });
}
function getListStandings() {
  title.innerHTML = "Klasemen Sementara Liga Primer Inggris";
  fetch(standingEndPoin, fetchHeader)
    .then((response) => response.json())
    .then((resJson) => {
      console.log(resJson.standings[0]);
      let teams = "";
      let i = 1;
      resJson.standings[0].table.forEach((team) => {
        teams += `
                <tr>
                    <td style="padding-left:20px;">${i}.</td>
                    <td><img src="${team.team.crestUrl}" alt="${team.team.name}" width="30px"></td>
                    <td>${team.team.name}</td>
                    <td>${team.playedGames}</td>
                    <td>${team.won}</td>
                    <td>${team.draw}</td>
                    <td>${team.lost}</td>
                    <td>${team.points}</td>
                </tr>
                `;
        i++;
      });
      contents.innerHTML = `
                <div class="card">
                    <table class="stripped responsive-table">
                        <thead>
                            <th></th>
                            <th></th>
                            <th>Nama Tim</th>
                            <th>PG</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>P</th>
                        </thead>
                        <tbody>
                            ${teams}
                        </tbody>
                    </table>
                </div>
            `;
    })
    .catch((err) => {
      console.error(err);
    });
}

function getListMatches() {
  title.innerHTML = "Jadwal Pertandingan Liga Primer Inggris";
  fetch(matchEndPoin, fetchHeader)
    .then((response) => response.json())
    .then((resJson) => {
      console.log(resJson.matches);
      let matchs = "";
      let i = 1;
      resJson.matches.forEach((match) => {
        let d = new Date(match.utcDate).toLocaleDateString("id");
        let scoreHomeTeam =
          match.score.fullTime.homeTeam == null
            ? 0
            : match.score.fullTime.homeTeam;
        let scoreAwayTeam =
          match.score.fullTime.awayTeam == null
            ? 0
            : match.score.fullTime.awayTeam;
        matchs += `
                <tr>
                    <td style="padding-left:20px;">${i}.</td>
                    <td>${match.homeTeam.name} vs ${match.awayTeam.name}</td>
                    <td>${d}</td>
                    <td>${scoreHomeTeam}:${scoreAwayTeam}</td>
                </tr>
                `;
        i++;
      });
      contents.innerHTML = `
                <div class="card">
                    <table class="stripped responsive-table">
                        <thead>
                            <th></th>
                            <th>Peserta</th>
                            <th>Tanggal</th>
                            <th>Skor Akhir</th>
                        </thead>
                        <tbody>
                            ${matchs}
                        </tbody>
                    </table>
                </div>
            `;
    })
    .catch((err) => {
      console.error(err);
    });
}

function loadPage(page) {
  switch (page) {
    case "teams":
      getListTeams();
      break;
    case "standings":
      getListStandings();
      break;
    case "matches":
      getListMatches();
      break;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems);

  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems);

  document.querySelectorAll(".sidenav a, .topnav a").forEach((elm) => {
    elm.addEventListener("click", (evt) => {
      let sideNav = document.querySelector(".sidenav");
      M.Sidenav.getInstance(sideNav).close();
      page = evt.target.getAttribute("href").substr(1);
      loadPage(page);
    });
  });
  var page = window.location.hash.substr(1);
  if (page === "" || page === "!") page = "teams";
  loadPage(page);
});
