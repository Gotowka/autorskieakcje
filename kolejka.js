module.exports = {
    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------
  
    name: "Kolejka",
  
    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------
  
    section: "Audio Control",
  
    //---------------------------------------------------------------------
    // Action Subtitle
    //
    // This function generates the subtitle displayed next to the name.
    //---------------------------------------------------------------------
  
    subtitle(data, presets) {
      return `${data.url}`;
    },
  
    variableStorage(data, varType) {
        const type = parseInt(data.storage, 10);
        if (type !== varType) return;
        let dataType = "Kolejka";
        return [data.varName2, dataType];
      },
  
    meta: { version: "2.1.6", preciseCheck: true, author: 'Gotowka', authorUrl: 'https://github.com/Gotowka/autorskieakcje/blob/main/kolejka.js', downloadUrl: 'https://github.com/Gotowka/autorskieakcje/blob/main/kolejka.js' },
  
    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------
  
    fields: ["page", "storage", "varName2"],
  
    //---------------------------------------------------------------------
    // Command HTML
    //
    // This function returns a string containing the HTML used for
    // editing actions.
    //
    // The "isEvent" parameter will be true if this action is being used
    // for an event. Due to their nature, events lack certain information,
    // so edit the HTML to reflect this.
    //---------------------------------------------------------------------
  
    html(isEvent, data) {
      return `
      <div>
      <p>
          <u>Mod Info:</u><br>
          Created by money#6283
      </p>
  </div><br>
  <span class="dbminputlabel">Parameter (Nazwa parametru w kt??rym jest nummer strony kolejki)</span>
<input id="page" class="round" type="text">
<br><br>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
    },
  
    //---------------------------------------------------------------------
    // Action Editor Init Code
    //
    // When the HTML is first applied to the action editor, this code
    // is also run. This helps add modifications or setup reactionary
    // functions for the DOM elements.
    //---------------------------------------------------------------------
  
    init() {},
  
    //---------------------------------------------------------------------
    // Action Bot Function
    //
    // This is the function for the action within the Bot's Action class.
    // Keep in mind event calls won't have access to the "msg" parameter,
    // so be sure to provide checks for variable existence.
    //---------------------------------------------------------------------
  
    async action(cache) {
      const { interaction } = cache
      const data = cache.actions[cache.index];
      const { Player } = require('discord-player')
      const { Client, Intents } = require('discord.js')
      const client = new Client({ intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
      ], partials: [
        "MESSAGE",
        "CHANNEL",
        "GUILD_MEMBER",
        "REACTION"
      ]});
      client.player = new Player(client, {
      ytdlOptions: {
          quality: "highestaudio",
          highWaterMark: 1 << 25
      }
      })
      const url = this.evalMessage(data.url, cache)

      if (!interaction.member.voice.channel) return interaction.reply("B????d: Musisz by?? na kanale by u??y?? tej komendy!")
      const queue = client.player.getQueue(interaction.guild)
      if (!queue || !queue.playing){
        return interaction.reply("B????d: Nie ma piosenek w kolejce")
    }
      const totalPages = Math.ceil(queue.tracks.length / 10) || 1
      const page = (interaction.options.getNumber(data.page) || 1) - 1

      if (page > totalPages) 
          return await interaction.reply(`B????d: Istniej?? tylko ${totalPages} strony`)
      
      const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
          return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
      }).join("\n")

      const currentSong = queue.current

     this.storeValue(currentSong.duration, 1, 'duration', cache);
     this.storeValue(currentSong.title, 1, 'title', cache);
     this.storeValue(currentSong.requestedBy.tag, 1, 'author', cache);
     this.storeValue(queueString, 1, 'piosenki', cache);
     this.storeValue(page + 1, 1, 'strona', cache);
     this.storeValue(totalPages, 1, 'strony', cache);
     this.storeValue(currentSong.setThumbnail, 1, 'thumbnail', cache);
    this.callNextAction(cache);
    },
  
    //---------------------------------------------------------------------
    // Action Bot Mod
    //
    // Upon initialization of the bot, this code is run. Using the bot's
    // DBM namespace, one can add/modify existing functions if necessary.
    // In order to reduce conflicts between mods, be sure to alias
    // functions you wish to overwrite.
    //---------------------------------------------------------------------
  
    mod() {},
};
