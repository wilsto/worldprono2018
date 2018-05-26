/// <reference path="../../typings/tsd.d.ts" />
'use strict';
(function() {

  class PronoComponent {

    menu = [
      { name: 'Prono', href: '/prono', section: '', ngclick: '', class: 'active', a_class: 'nothing' },
      { name: 'Arena', href: '/arena', section: '', ngclick: '', class: 'nothing', a_class: 'nothing' },
      { name: 'Leagues', href: '/league', section: '', ngclick: '', class: 'nothing', a_class: 'nothing' },
      { name: 'Players', href: '/player', section: '', ngclick: '', class: 'nothing', a_class: 'nothing' },
      { name: 'Rules', href: '/rules', section: '', ngclick: '', class: 'nothing', a_class: 'nothing' },
      { name: 'Stats', href: '/stats', section: '', ngclick: '', class: 'nothing', a_class: 'nothing' }
    ];


    constructor($http, Auth, $stateParams, $timeout) {
      this.$http = $http;
      this.isLoggedIn = Auth.isLoggedIn;
      this.isAdmin = Auth.isAdmin;
      this.$timeout = $timeout;
      this.getCurrentUser = Auth.getCurrentUser;
      this.matchs = [];
      this.groupThird = [];
      this.teamWinner = '';
      this.myPlayerPage = $stateParams.userId === undefined;
      this.$stateParams = $stateParams;
    }

    $onInit() {
      this.loadMatchs();
    }

    loadMatchs() {
      var that = this;
      //on récupère les matchs
      this.$http.get('/api/matchs').then(responseMatchs => {

        this.matchs = responseMatchs.data;
        console.log('THIS.MATCHS', this.matchs)

        // création des groupes à partir des infos matchs
        this.groups = _.sortBy(_.uniq(_.map(this.matchs, element => {
          return { name: element.group, order: element.grouporder };
        }), 'name'), 'order');

        this.getCurrentUser(function(user) {
          that.playerId = (that.$stateParams.userId) ? that.$stateParams.userId : user._id; // recupère le nom de l'utilisateur
          that.loadProno();
        });
      });

      // on récupère les équipes
      this.$http.get('/api/teams').then(response2 => {
        this.teams = response2.data;

        // initialisation des points
        this.teams = _.map(this.teams, function(team) {
          team.points = 0;
          team.diff = 0;
          team.played = 0;
          return team;
        });
      });
    }

    loadProno() {
      var that = this;
      // on récupère les pronos du joueur sinon on crèe le squelette
      this.$http.get('/api/pronos/user_id/' + this.playerId).then(responseProno => {
        if (responseProno.data[0] !== undefined) {
          this.prono = responseProno.data[0];
          this.toUpdate = true;
          this.mergeByProperty(this.matchs, this.prono.matchs, '_id');
        } else {
          this.prono = { user_id: this.getCurrentUser()._id, date: Date.now() };
          this.mergeByProperty(this.matchs, this.matchs, '_id');
          this.toUpdate = false;
        }
        this.$timeout(function() {
          _.map(that.groups, group => {
            if (group.name.length < 2) {
              return that.calculGroup(group.name);
            }
          });
          _.map(that.groups, group => {
            if (group.name.length > 2) {
              return that.calculQualified(group.name);
            }
          });
        }, 50);

      });
    }

    mergeByProperty(arr1, arr2, prop) {
      _.each(arr2, function(arr2obj) {
        var arr1objFinal = _.find(arr1, function(arr1obj) {
          return arr1obj[prop] === arr2obj[prop];
        });

        //If the object already exist extend it with the new values from arr2, otherwise just add the new object to arr1
        arr1objFinal ? _.extend(arr1objFinal, arr2obj) : arr1.push(arr2obj);
        arr1objFinal.teamId1 = arr1objFinal.teamId1 || arr1objFinal.team1;
        arr1objFinal.teamId2 = arr1objFinal.teamId2 || arr1objFinal.team2;
      });
    }

    // filtre les matchs dans le bon groupe
    filterGroup(groupName) {
      return function(match) {
        return match.group === groupName;
      };
    }

    // dès qu'un score change dans un match (appelé par ng-change)
    scoreChange(match, groupName) {
      match.result = (match.score1 && match.score2) ? match.score1 - match.score2 : null;
      if (match.result !== null) {
        if (match.result === 0) {
          match.team1points = 1;
          match.team1diff = match.result;
          match.team2points = 1;
          match.team2diff = match.result;
          if (groupName.length === 1) {
            match.winner = null;
          } else {
            match.resultPenalties = (match.penalties1 && match.penalties2) ? match.penalties1 - match.penalties2 : null;
            if (match.resultPenalties === 0) {
              match.winner = null;
            } else {
              match.winner = (match.resultPenalties > 0) ? match.team1 : match.team2;
            }
          }
        }
        if (match.result > 0) {
          match.team1points = 3;
          match.team1diff = match.result;
          match.team2points = 0;
          match.team2diff = -match.result;
          match.winner = match.team1;
        }
        if (match.result < 0) {
          match.team1points = 0;
          match.team1diff = match.result;
          match.team2points = 3;
          match.team2diff = -match.result;
          match.winner = match.team2;
        }
      } else {
        match.team1points = null;
        match.team1diff = null;
        match.team2points = null;
        match.team2diff = null;
        match.winner = null;
      }
      this.calculGroup(groupName);
      _.each(this.matchs, (currentMatch) => {
        if (currentMatch.date > match.date && (match.team1 === currentMatch.team1 || match.team1 === currentMatch.team2 || match.team2 === currentMatch.team1 || match.team2 === currentMatch.team2)) {
          this.scoreChange(currentMatch, currentMatch.group);
        }
      });
    }

    // calcul les scores pour les groupes
    calculGroup(groupName) {
      var that = this;

      that.groupTeams = _.filter(this.teams, { group: groupName });
      console.log('THAT.GROUPTEAMS', that.groupTeams)
      that.groupMatchs = _.filter(this.matchs, { group: groupName });
      console.log('THAT.GROUPMATCHS', that.groupMatchs)
      _.each(that.groupTeams, function(team) {
        team.versus = [];
        var sumTeam1 = _.chain(that.groupMatchs)
          .where({ team1: team.name })
          .map(function(subteam) {
            // sauvegarde les résultats contre les autres équipes
            var versus = { 'name': subteam.team1, 'versus': subteam.team2, 'points': subteam.team1points, 'diff': subteam.team1diff, 'bp': subteam.score1 };
            team.versus.push(versus);
            return subteam;
          })
          .reduce(function(memo, subteam) {
            return {
              points: (subteam.team1points) ? memo.points + subteam.team1points : memo.points,
              played: (that.isInteger(subteam.team1points)) ? memo.played + 1 : memo.played,
              win: (subteam.team1points === 3) ? memo.win + 1 : memo.win,
              draw: (subteam.team1points === 1) ? memo.draw + 1 : memo.draw,
              loss: (subteam.team1points === 0) ? memo.loss + 1 : memo.loss,
              bp: (subteam.score1) ? memo.bp + parseInt(subteam.score1, 10) : memo.bp,
              bc: (subteam.score2) ? memo.bc + parseInt(subteam.score2, 10) : memo.bc,
              diff: (subteam.team1diff) ? memo.diff + subteam.team1diff : memo.diff,
            };
          }, { points: 0, diff: 0, played: 0, win: 0, draw: 0, loss: 0, bp: 0, bc: 0, versus: [] })
          .value();
        var sumTeam2 = _.chain(that.groupMatchs)
          .where({ team2: team.name })
          .map(function(subteam) {
            // sauvegarde les résultats contre les autres équipes
            var versus = { 'name': subteam.team2, 'versus': subteam.team1, 'points': subteam.team2points, 'diff': subteam.team2diff, 'bp': subteam.score2 };
            team.versus.push(versus);
            return subteam;
          })
          .reduce(function(memo, subteam) {
            return {
              points: (subteam.team2points) ? memo.points + subteam.team2points : memo.points,
              played: (that.isInteger(subteam.team2points)) ? memo.played + 1 : memo.played,
              win: (subteam.team2points === 3) ? memo.win + 1 : memo.win,
              draw: (subteam.team2points === 1) ? memo.draw + 1 : memo.draw,
              loss: (subteam.team2points === 0) ? memo.loss + 1 : memo.loss,
              bc: (subteam.score1) ? memo.bc + parseInt(subteam.score1, 10) : memo.bc,
              bp: (subteam.score2) ? memo.bp + parseInt(subteam.score2, 10) : memo.bp,
              diff: (subteam.team2diff) ? memo.diff + subteam.team2diff : memo.diff
            };
          }, { points: 0, diff: 0, played: 0, win: 0, draw: 0, loss: 0, bp: 0, bc: 0 })
          .value();
        team.points = sumTeam2.points + sumTeam1.points;
        team.win = sumTeam2.win + sumTeam1.win;
        team.draw = sumTeam2.draw + sumTeam1.draw;
        team.loss = sumTeam2.loss + sumTeam1.loss;
        team.played = sumTeam2.played + sumTeam1.played;
        team.bp = sumTeam2.bp + sumTeam1.bp;
        team.bc = sumTeam2.bc + sumTeam1.bc;
        team.diff = sumTeam2.diff + sumTeam1.diff;
      });

      if (_.contains(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], groupName)) {

        //ordre du groupe selon les règles fifa
        that.groupTeams = that.sortGroupOrder(that.groupTeams);

        // si tous les matchs ont été joués dans le groupe = 12 scores, alors on reporte les équipes qualifiées pour les quarts
        that.nbmatchs = _.compact(_.pluck(that.groupMatchs, 'score1')).length + _.compact(_.pluck(that.groupMatchs, 'score2')).length;
        if (that.nbmatchs === 12) {
          that.winnerGroupMatch = _.filter(this.matchs, match => {
            return match.teamId1 === 'First ' + groupName || match.teamId2 === 'First ' + groupName;
          });
          if (that.winnerGroupMatch[0] !== undefined) {
            that.winnerGroupMatch[0].team1 = that.groupTeams[0].name;
          }

          that.RunnerupGroup1 = _.filter(this.matchs, match => {
            return match.teamId1 === 'Second ' + groupName;
          });
          if (that.RunnerupGroup1[0] !== undefined) {
            that.RunnerupGroup1[0].team1 = that.groupTeams[1].name;
          }

          that.RunnerupGroup2 = _.filter(this.matchs, match => {
            return match.teamId2 === 'Second ' + groupName;
          });
          if (that.RunnerupGroup2[0] !== undefined) {
            that.RunnerupGroup2[0].team2 = that.groupTeams[1].name;
          }

        }
      } else {
        this.calculQualified(groupName);
      }

    }

    isInteger(x) {
      return x % 1 === 0;
    }

    // retourne la valeur la plus petite des grouporder du group (appelé par ng-repeat GROUP)
    _grouporder(arr) {
      return _.min(_.map(arr, function(group) {
        return parseInt(group.grouporder, 10);
      }));
    }

    // tri des groupes selon les règles fifa
    sortGroupOrder(arrGroupTeams) {
      var that = this;
      arrGroupTeams = _.sortBy(arrGroupTeams, ['points'].reverse());
      arrGroupTeams.forEach(function(rank, index) {
        arrGroupTeams[index].rank1 = 99;
        arrGroupTeams[index].rank2 = 99;
        arrGroupTeams[index].rank3 = 99;
        arrGroupTeams[index].rank4 = 99;
        arrGroupTeams[index].rank5 = 99;
        arrGroupTeams[index].rank6 = 99;
        arrGroupTeams[index].rank7 = 99;
        arrGroupTeams[index].rank8 = 99;
      });


      // création du rank 1 : points en total
      var val1GroupTeams = _.pluck(arrGroupTeams, 'points');
      var rank1GroupTeams = this.rankArray(val1GroupTeams);
      rank1GroupTeams.forEach(function(rank, index) {
        arrGroupTeams[index].rank1 = rank1GroupTeams[index];
      });

      // création du rank 5 : diff en total
      var val5GroupTeams = _.pluck(arrGroupTeams, 'diff');
      var rank5GroupTeams = this.rankArray(val5GroupTeams);
      rank5GroupTeams.forEach(function(rank, index) {
        arrGroupTeams[index].rank5 = rank5GroupTeams[index];
      });

      // création du rank 6 : bp en total
      var val6GroupTeams = _.pluck(arrGroupTeams, 'bp');
      var rank6GroupTeams = this.rankArray(val6GroupTeams);
      rank6GroupTeams.forEach(function(rank, index) {
        arrGroupTeams[index].rank6 = rank6GroupTeams[index];
      });

      // création des groupes d'équipes exaequo = meme rang 1
      // Il peut y en avoir plusieurs.
      var prevRank = -1;
      var arrGroup = new Array();
      var nbofGroup = 0;
      var missingFirst = true;
      rank1GroupTeams.forEach(function(rank, index) {
        if (rank === prevRank) {
          if (!arrGroup[nbofGroup]) {
            arrGroup[nbofGroup] = new Array(); //créer
          }
          if (missingFirst) {
            arrGroup[nbofGroup].push(arrGroupTeams.slice(index - 1, index)[0]); // ajouter aussi le précédent
          }
          missingFirst = false;
          arrGroup[nbofGroup].push(arrGroupTeams.slice(index, index + 1)[0]); // ajouter le courant
        } else {
          missingFirst = true;
          if (arrGroup[nbofGroup]) {
            nbofGroup += 1;
          }
        }
        prevRank = rank;
      });

      // si au moins un groupe d'équipes exaequo
      // Recherche des résultats de matchs entre les exaequo
      if (arrGroup.length > 0) {
        arrGroup.forEach(function(groupExaequo, index) {
          var nameEqualTeams = _.pluck(groupExaequo, 'name');
          var listTeamEqual = _.chain(groupExaequo)
            .reduce(function(memo, team) {
              team.versus.forEach(function(versus) {
                if (_.contains(nameEqualTeams, versus.versus)) {
                  memo.push(versus);
                }
              });
              return memo;
            }, [])
            .value();
          var listTeamEqual2 = _.chain(listTeamEqual)
            .groupBy('name')
            .map(function(value, key) {
              return [key, _.reduce(value, function(result, currentObject) {
                return {
                  points: result.points + currentObject.points,
                  diff: result.diff + currentObject.diff,
                  bp: result.bp + parseInt(currentObject.bp, 10)
                };
              }, {
                  points: 0,
                  diff: 0,
                  bp: 0
                })];
            })
            .object()
            .value();

          // nombre de points intra equal
          var val2GroupTeams = _.pluck(listTeamEqual2, 'points');
          var rank2GroupTeams = that.rankArray(val2GroupTeams);
          var iteration = 0;
          _.each(listTeamEqual2, function(value, key) {
            var rank2Team = _.filter(arrGroupTeams, { name: key });
            rank2Team[0].rank2 = rank2GroupTeams[iteration];
            iteration += 1;
          });

          // nombre de diff intra equal
          var val3GroupTeams = _.pluck(listTeamEqual2, 'diff');
          var rank3GroupTeams = that.rankArray(val3GroupTeams);
          iteration = 0;
          _.each(listTeamEqual2, function(value, key) {
            var rank3Team = _.filter(arrGroupTeams, { name: key });
            rank3Team[0].rank3 = rank3GroupTeams[iteration];
            iteration += 1;
          });

          // nombre de buts marqués intra equal
          var val4GroupTeams = _.pluck(listTeamEqual2, 'bp');
          var rank4GroupTeams = that.rankArray(val4GroupTeams);
          iteration = 0;
          _.each(listTeamEqual2, function(value, key) {
            var rank4Team = _.filter(arrGroupTeams, { name: key });
            rank4Team[0].rank4 = rank4GroupTeams[iteration];
            iteration += 1;
          });
        });
      }
      arrGroupTeams = _.sortBy(arrGroupTeams, ['rank1', 'rank2', 'rank3', 'rank4', 'rank5', 'rank6', 'rank7', 'rank8']);
      return arrGroupTeams;
    }

    // renvoi un tableau de rang
    // [27,2,16,4] renvoie [1,4,2,3]
    rankArray(arr) {
      var sorted = arr.slice().sort(function(a, b) {
        return b - a;
      });
      var ranks = arr.slice().map(function(v) {
        return sorted.indexOf(v) + 1;
      });
      return ranks;
    }

    calculQualified(group) {
      var matchsGroup = _.filter(this.matchs, { 'group': group }); // les match du groupe
      _.map(matchsGroup, match => {
        var matchqualified1 = _.filter(this.matchs, { 'teamId1': 'Winner match ' + match.typematch }); // les match - Equipe de gauche
        var matchqualified2 = _.filter(this.matchs, { 'teamId2': 'Winner match ' + match.typematch }); // les match - Equipe de droite

        // si il y a un vainqueur
        if (match.winner !== undefined && match.winner !== null) {
          if (group !== 'Final') {
            (matchqualified1[0] !== undefined) ? matchqualified1[0].team1 = match.winner : matchqualified2[0].team2 = match.winner;
          } else {
            this.teamWinner = match.winner;
          }
        } else {
          if (group !== 'Final') {
            (matchqualified1[0] !== undefined) ? matchqualified1[0].team1 = matchqualified1[0].teamId1: matchqualified2[0].team2 = matchqualified2[0].teamId2;
          }
        }
      });
    }

    //sauvegarde les pronos
    resetProno() {
      this.$http.delete('/api/pronos/' + this.prono._id).then(response => {
        this.loadMatchs();
        this.loadProno();
        this.teamWinner = null;
      });
    }

    //sauvegarde les pronos
    saveProno() {
      var dateNow = parseInt((Date.now() / 1000), 10);
      if (dateNow > 1529006400) {
        bootbox.confirm('Attention des matchs ont déjà commencés ou sont déjà finis, ils seront exclus et non comptabilisés de votre classement si vous enregistez à nouveau.<br/><br/><span style="color:red"><b> Nous vous déconseillons de le faire, etes vous sur de vouloir continuer ? Si vous répondez "OK", votre choix est irrémédiable.</b></span>', (result) => {
          if (result) {
            this.saveInbase();
          }
        });
      } else {
        this.saveInbase();
      }
    }

    saveInbase() {
      this.prono.matchs = this.matchs;
      this.prono.date = Date.now();
      this.prono.user_id = this.getCurrentUser()._id;
      // si prono existe déjà
      if (this.toUpdate) {
        this.$http.put('/api/pronos/' + this.prono._id, this.prono).then(response => {
          this.loadProno();
        });
      } else {
        // sinon on crèe les pronos
        this.$http.post('/api/pronos', this.prono).then(response => {
          this.toUpdate = true;
        });
      }
    }

  }

  angular.module('worldProno2018App')
    .component('prono', {
      templateUrl: 'app/prono/prono.html',
      controller: PronoComponent,
      controllerAs: 'vm'
    });

})();
