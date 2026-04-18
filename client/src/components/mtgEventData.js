// ============================================================
// Comprehensive MTG Event/Trigger, Condition, and Action data
// ============================================================

export const TRIGGER_EVENTS = [
  // Phase/Step Triggers
  {
    id: "beginning_of_upkeep",
    label: "At the beginning of your upkeep",
    category: "Phase/Step",
  },
  {
    id: "beginning_of_each_upkeep",
    label: "At the beginning of each upkeep",
    category: "Phase/Step",
  },
  {
    id: "beginning_of_opponent_upkeep",
    label: "At the beginning of each opponent's upkeep",
    category: "Phase/Step",
  },
  {
    id: "beginning_of_draw_step",
    label: "At the beginning of your draw step",
    category: "Phase/Step",
  },
  {
    id: "beginning_of_precombat_main",
    label: "At the beginning of your precombat main phase",
    category: "Phase/Step",
  },
  {
    id: "beginning_of_postcombat_main",
    label: "At the beginning of your postcombat main phase",
    category: "Phase/Step",
  },
  {
    id: "beginning_of_combat",
    label: "At the beginning of combat on your turn",
    category: "Phase/Step",
  },
  {
    id: "beginning_of_each_combat",
    label: "At the beginning of each combat",
    category: "Phase/Step",
  },
  {
    id: "declare_attackers_step",
    label: "At the beginning of the declare attackers step",
    category: "Phase/Step",
  },
  {
    id: "declare_blockers_step",
    label: "At the beginning of the declare blockers step",
    category: "Phase/Step",
  },
  {
    id: "combat_damage_step",
    label: "During the combat damage step",
    category: "Phase/Step",
  },
  { id: "end_of_combat", label: "At end of combat", category: "Phase/Step" },
  {
    id: "beginning_of_end_step",
    label: "At the beginning of your end step",
    category: "Phase/Step",
  },
  {
    id: "beginning_of_each_end_step",
    label: "At the beginning of each end step",
    category: "Phase/Step",
  },
  {
    id: "beginning_of_next_end_step",
    label: "At the beginning of the next end step",
    category: "Phase/Step",
  },
  {
    id: "cleanup_step",
    label: "During the cleanup step",
    category: "Phase/Step",
  },
  {
    id: "beginning_of_each_players_upkeep",
    label: "At the beginning of each player's upkeep",
    category: "Phase/Step",
  },
  {
    id: "beginning_of_each_players_end_step",
    label: "At the beginning of each player's end step",
    category: "Phase/Step",
  },
  {
    id: "beginning_of_each_players_draw_step",
    label: "At the beginning of each player's draw step",
    category: "Phase/Step",
  },

  // Zone Change Triggers
  {
    id: "enters_battlefield",
    label: "When this enters the battlefield",
    category: "Zone Change",
  },
  {
    id: "creature_enters",
    label: "Whenever a creature enters the battlefield",
    category: "Zone Change",
  },
  {
    id: "creature_enters_under_your_control",
    label: "Whenever a creature enters the battlefield under your control",
    category: "Zone Change",
  },
  {
    id: "nontoken_creature_enters",
    label: "Whenever a nontoken creature enters the battlefield",
    category: "Zone Change",
  },
  {
    id: "artifact_enters",
    label: "Whenever an artifact enters the battlefield",
    category: "Zone Change",
  },
  {
    id: "enchantment_enters",
    label: "Whenever an enchantment enters the battlefield",
    category: "Zone Change",
  },
  {
    id: "permanent_enters",
    label: "Whenever a permanent enters the battlefield",
    category: "Zone Change",
  },
  {
    id: "another_creature_enters",
    label:
      "Whenever another creature enters the battlefield under your control",
    category: "Zone Change",
  },
  {
    id: "token_enters",
    label: "Whenever a token enters the battlefield",
    category: "Zone Change",
  },
  {
    id: "planeswalker_enters",
    label: "Whenever a planeswalker enters the battlefield",
    category: "Zone Change",
  },
  {
    id: "land_enters",
    label: "Whenever a land enters the battlefield under your control",
    category: "Zone Change",
  },
  {
    id: "leaves_battlefield",
    label: "When this leaves the battlefield",
    category: "Zone Change",
  },
  {
    id: "creature_leaves",
    label: "Whenever a creature leaves the battlefield",
    category: "Zone Change",
  },
  {
    id: "permanent_leaves",
    label: "Whenever a permanent you control leaves the battlefield",
    category: "Zone Change",
  },
  {
    id: "another_creature_leaves",
    label: "Whenever another creature leaves the battlefield",
    category: "Zone Change",
  },
  {
    id: "artifact_or_creature_enters",
    label: "Whenever an artifact or creature enters under your control",
    category: "Zone Change",
  },

  // Death/Graveyard Triggers
  { id: "dies", label: "When this creature dies", category: "Death" },
  { id: "creature_dies", label: "Whenever a creature dies", category: "Death" },
  {
    id: "creature_you_control_dies",
    label: "Whenever a creature you control dies",
    category: "Death",
  },
  {
    id: "another_creature_dies",
    label: "Whenever another creature dies",
    category: "Death",
  },
  {
    id: "another_creature_you_control_dies",
    label: "Whenever another creature you control dies",
    category: "Death",
  },
  {
    id: "nontoken_creature_dies",
    label: "Whenever a nontoken creature dies",
    category: "Death",
  },
  {
    id: "creature_opponent_controls_dies",
    label: "Whenever a creature an opponent controls dies",
    category: "Death",
  },
  {
    id: "token_dies",
    label: "Whenever a token you control dies",
    category: "Death",
  },
  {
    id: "enchantment_dies",
    label: "Whenever an enchantment is put into a graveyard",
    category: "Death",
  },
  {
    id: "artifact_put_into_graveyard",
    label: "Whenever an artifact is put into a graveyard",
    category: "Death",
  },
  {
    id: "permanent_put_into_graveyard",
    label: "Whenever a permanent is put into a graveyard",
    category: "Death",
  },
  {
    id: "card_put_into_graveyard_from_anywhere",
    label: "Whenever a card is put into a graveyard from anywhere",
    category: "Death",
  },
  {
    id: "card_put_into_your_graveyard",
    label: "Whenever one or more cards are put into your graveyard",
    category: "Death",
  },
  {
    id: "card_put_into_graveyard_from_library",
    label: "Whenever cards are put into your graveyard from your library",
    category: "Death",
  },

  // Spell/Cast Triggers
  {
    id: "you_cast_spell",
    label: "Whenever you cast a spell",
    category: "Spells",
  },
  {
    id: "you_cast_creature_spell",
    label: "Whenever you cast a creature spell",
    category: "Spells",
  },
  {
    id: "you_cast_noncreature_spell",
    label: "Whenever you cast a noncreature spell",
    category: "Spells",
  },
  {
    id: "you_cast_instant_or_sorcery",
    label: "Whenever you cast an instant or sorcery spell",
    category: "Spells",
  },
  {
    id: "you_cast_artifact_spell",
    label: "Whenever you cast an artifact spell",
    category: "Spells",
  },
  {
    id: "you_cast_enchantment_spell",
    label: "Whenever you cast an enchantment spell",
    category: "Spells",
  },
  {
    id: "you_cast_historic_spell",
    label: "Whenever you cast a historic spell",
    category: "Spells",
  },
  {
    id: "you_cast_legendary_spell",
    label: "Whenever you cast a legendary spell",
    category: "Spells",
  },
  {
    id: "opponent_casts_spell",
    label: "Whenever an opponent casts a spell",
    category: "Spells",
  },
  {
    id: "player_casts_spell",
    label: "Whenever a player casts a spell",
    category: "Spells",
  },
  {
    id: "you_cast_first_spell_each_turn",
    label: "Whenever you cast your first spell each turn",
    category: "Spells",
  },
  {
    id: "you_cast_second_spell_each_turn",
    label: "Whenever you cast your second spell each turn",
    category: "Spells",
  },
  {
    id: "spell_countered",
    label: "Whenever a spell is countered",
    category: "Spells",
  },
  {
    id: "you_cast_spell_from_graveyard",
    label: "Whenever you cast a spell from your graveyard",
    category: "Spells",
  },
  {
    id: "you_cast_spell_from_exile",
    label: "Whenever you cast a spell from exile",
    category: "Spells",
  },
  {
    id: "you_cast_multicolored_spell",
    label: "Whenever you cast a multicolored spell",
    category: "Spells",
  },
  {
    id: "you_cast_colorless_spell",
    label: "Whenever you cast a colorless spell",
    category: "Spells",
  },
  {
    id: "you_cast_cmc_x_or_greater",
    label: "Whenever you cast a spell with mana value X or greater",
    category: "Spells",
  },

  // Combat Triggers
  {
    id: "this_attacks",
    label: "Whenever this creature attacks",
    category: "Combat",
  },
  {
    id: "this_attacks_alone",
    label: "Whenever this creature attacks alone",
    category: "Combat",
  },
  {
    id: "creature_you_control_attacks",
    label: "Whenever a creature you control attacks",
    category: "Combat",
  },
  {
    id: "one_or_more_creatures_attack",
    label: "Whenever one or more creatures you control attack",
    category: "Combat",
  },
  {
    id: "this_blocks",
    label: "Whenever this creature blocks",
    category: "Combat",
  },
  {
    id: "this_blocks_or_becomes_blocked",
    label: "Whenever this creature blocks or becomes blocked",
    category: "Combat",
  },
  {
    id: "this_becomes_blocked",
    label: "Whenever this creature becomes blocked",
    category: "Combat",
  },
  {
    id: "creature_blocks",
    label: "Whenever a creature blocks",
    category: "Combat",
  },
  {
    id: "this_attacks_and_isnt_blocked",
    label: "Whenever this creature attacks and isn't blocked",
    category: "Combat",
  },
  {
    id: "creature_attacks_you",
    label: "Whenever a creature attacks you",
    category: "Combat",
  },
  {
    id: "creature_attacks_you_or_pw",
    label: "Whenever a creature attacks you or a planeswalker you control",
    category: "Combat",
  },
  {
    id: "creature_you_control_attacks_alone",
    label: "Whenever a creature you control attacks alone",
    category: "Combat",
  },
  {
    id: "two_or_more_creatures_attack",
    label: "Whenever two or more creatures you control attack",
    category: "Combat",
  },

  // Damage Triggers
  {
    id: "this_deals_damage",
    label: "Whenever this creature deals damage",
    category: "Damage",
  },
  {
    id: "this_deals_combat_damage",
    label: "Whenever this creature deals combat damage",
    category: "Damage",
  },
  {
    id: "this_deals_combat_damage_to_player",
    label: "Whenever this creature deals combat damage to a player",
    category: "Damage",
  },
  {
    id: "this_deals_combat_damage_to_opponent",
    label: "Whenever this creature deals combat damage to an opponent",
    category: "Damage",
  },
  {
    id: "creature_deals_combat_damage_to_you",
    label: "Whenever a creature deals combat damage to you",
    category: "Damage",
  },
  {
    id: "creature_you_control_deals_combat_damage_to_player",
    label: "Whenever a creature you control deals combat damage to a player",
    category: "Damage",
  },
  {
    id: "source_deals_damage",
    label: "Whenever a source deals damage to you",
    category: "Damage",
  },
  {
    id: "this_is_dealt_damage",
    label: "Whenever this creature is dealt damage",
    category: "Damage",
  },
  {
    id: "this_deals_damage_to_permanent",
    label: "Whenever this deals damage to a permanent",
    category: "Damage",
  },
  {
    id: "opponent_dealt_damage",
    label: "Whenever an opponent is dealt damage",
    category: "Damage",
  },
  {
    id: "one_or_more_creatures_deal_combat_damage",
    label:
      "Whenever one or more creatures you control deal combat damage to a player",
    category: "Damage",
  },
  {
    id: "noncombat_damage_dealt",
    label: "Whenever a source you control deals noncombat damage",
    category: "Damage",
  },

  // Life Triggers
  { id: "you_gain_life", label: "Whenever you gain life", category: "Life" },
  {
    id: "opponent_gains_life",
    label: "Whenever an opponent gains life",
    category: "Life",
  },
  { id: "you_lose_life", label: "Whenever you lose life", category: "Life" },
  {
    id: "opponent_loses_life",
    label: "Whenever an opponent loses life",
    category: "Life",
  },
  {
    id: "you_gain_life_first_time",
    label: "Whenever you gain life for the first time each turn",
    category: "Life",
  },
  { id: "life_paid", label: "Whenever you pay life", category: "Life" },

  // Card Draw/Discard Triggers
  {
    id: "you_draw_card",
    label: "Whenever you draw a card",
    category: "Draw/Discard",
  },
  {
    id: "opponent_draws_card",
    label: "Whenever an opponent draws a card",
    category: "Draw/Discard",
  },
  {
    id: "you_draw_second_card",
    label: "Whenever you draw your second card each turn",
    category: "Draw/Discard",
  },
  {
    id: "you_discard_card",
    label: "Whenever you discard a card",
    category: "Draw/Discard",
  },
  {
    id: "opponent_discards",
    label: "Whenever an opponent discards a card",
    category: "Draw/Discard",
  },
  {
    id: "you_cycle",
    label: "Whenever you cycle a card",
    category: "Draw/Discard",
  },
  {
    id: "you_cycle_or_discard",
    label: "Whenever you cycle or discard a card",
    category: "Draw/Discard",
  },

  // Tap/Untap Triggers
  {
    id: "this_becomes_tapped",
    label: "Whenever this becomes tapped",
    category: "Tap/Untap",
  },
  {
    id: "this_becomes_untapped",
    label: "Whenever this becomes untapped",
    category: "Tap/Untap",
  },
  {
    id: "creature_becomes_tapped",
    label: "Whenever a creature becomes tapped",
    category: "Tap/Untap",
  },
  {
    id: "creature_you_control_becomes_tapped",
    label: "Whenever a creature you control becomes tapped",
    category: "Tap/Untap",
  },
  {
    id: "permanent_becomes_tapped",
    label: "Whenever a permanent becomes tapped",
    category: "Tap/Untap",
  },
  {
    id: "permanent_opponent_controls_becomes_tapped",
    label: "Whenever a permanent an opponent controls becomes tapped",
    category: "Tap/Untap",
  },

  // Targeting Triggers
  {
    id: "this_becomes_target",
    label: "Whenever this becomes the target of a spell or ability",
    category: "Targeting",
  },
  {
    id: "this_becomes_target_of_spell",
    label: "Whenever this becomes the target of a spell",
    category: "Targeting",
  },
  {
    id: "creature_you_control_becomes_target",
    label: "Whenever a creature you control becomes the target",
    category: "Targeting",
  },
  {
    id: "you_become_target",
    label: "Whenever you become the target of a spell or ability",
    category: "Targeting",
  },

  // Counter Triggers
  {
    id: "counter_placed",
    label: "Whenever one or more counters are put on this",
    category: "Counters",
  },
  {
    id: "counter_placed_on_creature",
    label: "Whenever a counter is put on a creature you control",
    category: "Counters",
  },
  {
    id: "plus1_counter_placed",
    label: "Whenever one or more +1/+1 counters are put on this",
    category: "Counters",
  },
  {
    id: "counter_removed",
    label: "Whenever a counter is removed from this",
    category: "Counters",
  },
  {
    id: "plus1_placed_on_creature_you_control",
    label: "Whenever +1/+1 counters are put on a creature you control",
    category: "Counters",
  },

  // Exile Triggers
  { id: "card_exiled", label: "Whenever a card is exiled", category: "Exile" },
  {
    id: "card_exiled_from_graveyard",
    label: "Whenever cards are exiled from your graveyard",
    category: "Exile",
  },
  {
    id: "creature_exiled",
    label: "Whenever a creature is exiled",
    category: "Exile",
  },
  { id: "this_exiled", label: "When this is exiled", category: "Exile" },

  // Land Triggers
  {
    id: "landfall",
    label: "Landfall — Whenever a land enters under your control",
    category: "Land",
  },
  {
    id: "land_enters_any",
    label: "Whenever a land enters the battlefield",
    category: "Land",
  },
  { id: "you_play_land", label: "Whenever you play a land", category: "Land" },
  {
    id: "land_tapped_for_mana",
    label: "Whenever a land is tapped for mana",
    category: "Land",
  },
  {
    id: "land_destroyed",
    label: "Whenever a land is destroyed",
    category: "Land",
  },

  // Token Triggers
  {
    id: "token_created",
    label: "Whenever one or more tokens are created",
    category: "Tokens",
  },
  {
    id: "token_created_under_your_control",
    label: "Whenever a token is created under your control",
    category: "Tokens",
  },
  {
    id: "creature_token_created",
    label: "Whenever one or more creature tokens are created",
    category: "Tokens",
  },
  {
    id: "treasure_token_created",
    label: "Whenever a Treasure token is created",
    category: "Tokens",
  },

  // Sacrifice Triggers
  {
    id: "you_sacrifice_permanent",
    label: "Whenever you sacrifice a permanent",
    category: "Sacrifice",
  },
  {
    id: "you_sacrifice_creature",
    label: "Whenever you sacrifice a creature",
    category: "Sacrifice",
  },
  {
    id: "you_sacrifice_artifact",
    label: "Whenever you sacrifice an artifact",
    category: "Sacrifice",
  },
  {
    id: "opponent_sacrifices",
    label: "Whenever an opponent sacrifices a permanent",
    category: "Sacrifice",
  },

  // Library Triggers
  {
    id: "you_search_library",
    label: "Whenever you search your library",
    category: "Library",
  },
  {
    id: "you_shuffle_library",
    label: "Whenever you shuffle your library",
    category: "Library",
  },

  // Keyword-Named Triggers
  {
    id: "whenever_you_scry",
    label: "Whenever you scry",
    category: "Keyword Triggers",
  },
  {
    id: "whenever_you_surveil",
    label: "Whenever you surveil",
    category: "Keyword Triggers",
  },
  {
    id: "whenever_you_mill",
    label: "Whenever you mill one or more cards",
    category: "Keyword Triggers",
  },
  {
    id: "whenever_you_venture",
    label: "Whenever you venture into the dungeon",
    category: "Keyword Triggers",
  },
  {
    id: "whenever_you_connive",
    label: "Whenever a creature you control connives",
    category: "Keyword Triggers",
  },
  {
    id: "whenever_you_explore",
    label: "Whenever a creature you control explores",
    category: "Keyword Triggers",
  },
  {
    id: "whenever_you_proliferate",
    label: "Whenever you proliferate",
    category: "Keyword Triggers",
  },
  {
    id: "whenever_heroic",
    label: "Heroic — Whenever you cast a spell that targets this",
    category: "Keyword Triggers",
  },
  {
    id: "whenever_constellation",
    label: "Constellation — Whenever an enchantment enters under your control",
    category: "Keyword Triggers",
  },
  {
    id: "whenever_magecraft",
    label: "Magecraft — Whenever you cast or copy an instant or sorcery",
    category: "Keyword Triggers",
  },
  {
    id: "whenever_alliance",
    label: "Alliance — Whenever another creature enters under your control",
    category: "Keyword Triggers",
  },
  {
    id: "whenever_enrage",
    label: "Enrage — Whenever this creature is dealt damage",
    category: "Keyword Triggers",
  },

  // Equipment/Aura Triggers
  {
    id: "equipped_creature_attacks",
    label: "Whenever equipped creature attacks",
    category: "Equipment/Aura",
  },
  {
    id: "equipped_creature_deals_combat_damage",
    label: "Whenever equipped creature deals combat damage to a player",
    category: "Equipment/Aura",
  },
  {
    id: "equipped_creature_dies",
    label: "Whenever equipped creature dies",
    category: "Equipment/Aura",
  },
  {
    id: "enchanted_creature_attacks",
    label: "Whenever enchanted creature attacks",
    category: "Equipment/Aura",
  },
  {
    id: "enchanted_creature_deals_damage",
    label: "Whenever enchanted creature deals damage",
    category: "Equipment/Aura",
  },
  {
    id: "enchanted_creature_dies",
    label: "Whenever enchanted creature dies",
    category: "Equipment/Aura",
  },

  // Miscellaneous Triggers
  {
    id: "this_transforms",
    label: "When this transforms",
    category: "Miscellaneous",
  },
  {
    id: "day_becomes_night",
    label: "Whenever day becomes night",
    category: "Miscellaneous",
  },
  {
    id: "night_becomes_day",
    label: "Whenever night becomes day",
    category: "Miscellaneous",
  },
  {
    id: "coin_flipped",
    label: "Whenever a player flips a coin",
    category: "Miscellaneous",
  },
  {
    id: "you_win_coin_flip",
    label: "Whenever you win a coin flip",
    category: "Miscellaneous",
  },
  {
    id: "die_rolled",
    label: "Whenever you roll a die",
    category: "Miscellaneous",
  },
  {
    id: "ability_activated",
    label: "Whenever you activate an ability",
    category: "Miscellaneous",
  },
  {
    id: "you_become_monarch",
    label: "When you become the monarch",
    category: "Miscellaneous",
  },
  {
    id: "creature_mutates",
    label: "Whenever this creature mutates",
    category: "Miscellaneous",
  },
  {
    id: "you_commit_crime",
    label: "Whenever you commit a crime",
    category: "Miscellaneous",
  },
  { id: "phase_out", label: "When this phases out", category: "Miscellaneous" },
  { id: "phase_in", label: "When this phases in", category: "Miscellaneous" },
  {
    id: "poison_counter_given",
    label: "Whenever a player gets one or more poison counters",
    category: "Miscellaneous",
  },
  {
    id: "energy_counter",
    label: "Whenever you get one or more energy counters",
    category: "Miscellaneous",
  },
  {
    id: "commander_enters",
    label: "Whenever your commander enters the battlefield",
    category: "Miscellaneous",
  },
  {
    id: "commander_cast",
    label: "Whenever you cast your commander",
    category: "Miscellaneous",
  },
  {
    id: "saga_counter_added",
    label: "Whenever one or more lore counters are put on this Saga",
    category: "Miscellaneous",
  },
];

export const CONDITIONS = [
  // Logical Operators
  { id: "if", label: "If", category: "Logical" },
  { id: "and", label: "And", category: "Logical" },
  { id: "or", label: "Or", category: "Logical" },
  { id: "unless", label: "Unless", category: "Logical" },
  { id: "as_long_as", label: "As long as", category: "Logical" },
  { id: "only_if", label: "Only if", category: "Logical" },
  { id: "otherwise", label: "Otherwise", category: "Logical" },
  { id: "instead", label: "Instead", category: "Logical" },
  { id: "if_you_do", label: "If you do", category: "Logical" },
  { id: "if_you_dont", label: "If you don't", category: "Logical" },
  { id: "where_x_is", label: "Where X is", category: "Logical" },
  { id: "for_each", label: "For each", category: "Logical" },

  // Targeting
  { id: "target_creature", label: "Target creature", category: "Targeting" },
  { id: "target_player", label: "Target player", category: "Targeting" },
  { id: "target_opponent", label: "Target opponent", category: "Targeting" },
  { id: "target_permanent", label: "Target permanent", category: "Targeting" },
  { id: "target_artifact", label: "Target artifact", category: "Targeting" },
  {
    id: "target_enchantment",
    label: "Target enchantment",
    category: "Targeting",
  },
  { id: "target_land", label: "Target land", category: "Targeting" },
  {
    id: "target_planeswalker",
    label: "Target planeswalker",
    category: "Targeting",
  },
  { id: "target_spell", label: "Target spell", category: "Targeting" },
  {
    id: "target_nonland_permanent",
    label: "Target nonland permanent",
    category: "Targeting",
  },
  {
    id: "target_attacking_creature",
    label: "Target attacking creature",
    category: "Targeting",
  },
  {
    id: "target_blocking_creature",
    label: "Target blocking creature",
    category: "Targeting",
  },
  {
    id: "target_creature_or_planeswalker",
    label: "Target creature or planeswalker",
    category: "Targeting",
  },
  { id: "any_target", label: "Any target", category: "Targeting" },
  {
    id: "target_card_in_graveyard",
    label: "Target card in a graveyard",
    category: "Targeting",
  },
  {
    id: "target_creature_card_in_graveyard",
    label: "Target creature card in a graveyard",
    category: "Targeting",
  },
  { id: "up_to_x_targets", label: "Up to X target(s)", category: "Targeting" },
  { id: "each_opponent", label: "Each opponent", category: "Targeting" },
  { id: "each_player", label: "Each player", category: "Targeting" },

  // Quantity
  { id: "x_or_more", label: "X or more", category: "Quantity" },
  { id: "x_or_fewer", label: "X or fewer", category: "Quantity" },
  { id: "exactly_x", label: "Exactly X", category: "Quantity" },
  { id: "at_least_x", label: "At least X", category: "Quantity" },
  { id: "no_more_than_x", label: "No more than X", category: "Quantity" },
  { id: "each", label: "Each", category: "Quantity" },
  { id: "all", label: "All", category: "Quantity" },
  { id: "any_number_of", label: "Any number of", category: "Quantity" },
  { id: "one_or_more", label: "One or more", category: "Quantity" },

  // State
  { id: "tapped", label: "Tapped", category: "State" },
  { id: "untapped", label: "Untapped", category: "State" },
  { id: "attacking", label: "Attacking", category: "State" },
  { id: "blocking", label: "Blocking", category: "State" },
  { id: "blocked", label: "Blocked", category: "State" },
  { id: "unblocked", label: "Unblocked", category: "State" },
  { id: "enchanted", label: "Enchanted", category: "State" },
  { id: "equipped", label: "Equipped", category: "State" },
  { id: "face_down", label: "Face down", category: "State" },
  { id: "face_up", label: "Face up", category: "State" },
  { id: "transformed", label: "Transformed", category: "State" },
  { id: "monstrous", label: "Monstrous", category: "State" },
  { id: "renowned", label: "Renowned", category: "State" },
  { id: "suspected", label: "Suspected", category: "State" },
  { id: "token", label: "Token", category: "State" },
  { id: "nontoken", label: "Nontoken", category: "State" },
  { id: "legendary", label: "Legendary", category: "State" },
  { id: "historic", label: "Historic", category: "State" },
  { id: "has_counter", label: "Has a counter on it", category: "State" },
  { id: "has_plus1_counter", label: "Has a +1/+1 counter", category: "State" },
  {
    id: "modified",
    label: "Modified (equipped, enchanted, or counters)",
    category: "State",
  },

  // Type
  { id: "is_creature", label: "Is a creature", category: "Type" },
  { id: "is_artifact", label: "Is an artifact", category: "Type" },
  { id: "is_enchantment", label: "Is an enchantment", category: "Type" },
  { id: "is_land", label: "Is a land", category: "Type" },
  { id: "is_planeswalker", label: "Is a planeswalker", category: "Type" },
  { id: "is_instant", label: "Is an instant", category: "Type" },
  { id: "is_sorcery", label: "Is a sorcery", category: "Type" },
  { id: "is_noncreature", label: "Is a noncreature", category: "Type" },
  { id: "is_nonland", label: "Is a nonland", category: "Type" },
  { id: "is_permanent", label: "Is a permanent", category: "Type" },
  { id: "is_equipment", label: "Is an Equipment", category: "Type" },
  { id: "is_aura", label: "Is an Aura", category: "Type" },
  { id: "is_vehicle", label: "Is a Vehicle", category: "Type" },
  {
    id: "has_equipment_attached",
    label: "Has Equipment attached",
    category: "Type",
  },

  // Color
  { id: "is_white", label: "Is white", category: "Color" },
  { id: "is_blue", label: "Is blue", category: "Color" },
  { id: "is_black", label: "Is black", category: "Color" },
  { id: "is_red", label: "Is red", category: "Color" },
  { id: "is_green", label: "Is green", category: "Color" },
  { id: "is_colorless", label: "Is colorless", category: "Color" },
  { id: "is_multicolored", label: "Is multicolored", category: "Color" },

  // Power/Toughness
  {
    id: "power_x_or_less",
    label: "Power X or less",
    category: "Power/Toughness",
  },
  {
    id: "power_x_or_greater",
    label: "Power X or greater",
    category: "Power/Toughness",
  },
  {
    id: "toughness_x_or_less",
    label: "Toughness X or less",
    category: "Power/Toughness",
  },
  {
    id: "toughness_x_or_greater",
    label: "Toughness X or greater",
    category: "Power/Toughness",
  },
  {
    id: "greatest_power",
    label: "Greatest power among creatures you control",
    category: "Power/Toughness",
  },

  // Controller
  { id: "you_control", label: "You control", category: "Controller" },
  {
    id: "opponent_controls",
    label: "An opponent controls",
    category: "Controller",
  },
  {
    id: "you_dont_control",
    label: "You don't control",
    category: "Controller",
  },

  // Zone
  { id: "in_graveyard", label: "In a graveyard", category: "Zone" },
  { id: "in_your_graveyard", label: "In your graveyard", category: "Zone" },
  { id: "in_hand", label: "In your hand", category: "Zone" },
  { id: "on_battlefield", label: "On the battlefield", category: "Zone" },
  { id: "in_exile", label: "In exile", category: "Zone" },
  { id: "in_library", label: "In your library", category: "Zone" },

  // Mana Value
  {
    id: "mana_value_x_or_less",
    label: "Mana value X or less",
    category: "Mana Value",
  },
  {
    id: "mana_value_x_or_greater",
    label: "Mana value X or greater",
    category: "Mana Value",
  },
  {
    id: "mana_value_exactly_x",
    label: "Mana value exactly X",
    category: "Mana Value",
  },

  // Turn
  { id: "your_turn", label: "During your turn", category: "Turn" },
  {
    id: "opponents_turn",
    label: "During an opponent's turn",
    category: "Turn",
  },
  { id: "this_turn", label: "This turn", category: "Turn" },
  { id: "once_each_turn", label: "Only once each turn", category: "Turn" },
  {
    id: "attacked_this_turn",
    label: "If you attacked this turn",
    category: "Turn",
  },
  {
    id: "cast_spell_this_turn",
    label: "If you cast a spell this turn",
    category: "Turn",
  },
  {
    id: "two_or_more_spells_this_turn",
    label: "If two or more spells were cast this turn",
    category: "Turn",
  },

  // Named Conditions
  { id: "raid", label: "Raid — If you attacked this turn", category: "Named" },
  {
    id: "revolt",
    label: "Revolt — If a permanent you controlled left the battlefield",
    category: "Named",
  },
  {
    id: "threshold",
    label: "Threshold — If seven or more cards are in your graveyard",
    category: "Named",
  },
  {
    id: "delirium",
    label: "Delirium — If four or more card types in your graveyard",
    category: "Named",
  },
  {
    id: "corrupted",
    label: "Corrupted — If an opponent has three or more poison counters",
    category: "Named",
  },
  {
    id: "metalcraft",
    label: "Metalcraft — If you control three or more artifacts",
    category: "Named",
  },
  {
    id: "devotion",
    label: "Devotion — Based on mana symbols in permanents you control",
    category: "Named",
  },
  {
    id: "domain",
    label: "Domain — Based on basic land types among lands you control",
    category: "Named",
  },
];

export const KEYWORD_ACTIONS = [
  // Core
  { id: "activate", label: "Activate", category: "Core" },
  { id: "attach", label: "Attach", category: "Core" },
  { id: "cast", label: "Cast", category: "Core" },
  { id: "counter", label: "Counter", category: "Core" },
  { id: "create_token", label: "Create (token)", category: "Core" },
  { id: "destroy", label: "Destroy", category: "Core" },
  { id: "discard", label: "Discard", category: "Core" },
  { id: "exchange", label: "Exchange", category: "Core" },
  { id: "exile", label: "Exile", category: "Core" },
  { id: "fight", label: "Fight", category: "Core" },
  { id: "mill", label: "Mill", category: "Core" },
  { id: "play", label: "Play", category: "Core" },
  { id: "regenerate", label: "Regenerate", category: "Core" },
  { id: "reveal", label: "Reveal", category: "Core" },
  { id: "sacrifice", label: "Sacrifice", category: "Core" },
  { id: "scry", label: "Scry", category: "Core" },
  { id: "search", label: "Search", category: "Core" },
  { id: "shuffle", label: "Shuffle", category: "Core" },
  { id: "tap", label: "Tap", category: "Core" },
  { id: "untap", label: "Untap", category: "Core" },

  // Expansion
  { id: "fateseal", label: "Fateseal", category: "Expansion" },
  { id: "clash", label: "Clash", category: "Expansion" },
  { id: "proliferate", label: "Proliferate", category: "Expansion" },
  { id: "transform", label: "Transform", category: "Expansion" },
  { id: "detain", label: "Detain", category: "Expansion" },
  { id: "populate", label: "Populate", category: "Expansion" },
  { id: "monstrosity", label: "Monstrosity", category: "Expansion" },
  { id: "vote", label: "Vote", category: "Expansion" },
  { id: "bolster", label: "Bolster", category: "Expansion" },
  { id: "manifest", label: "Manifest", category: "Expansion" },
  { id: "support", label: "Support", category: "Expansion" },
  { id: "investigate", label: "Investigate", category: "Expansion" },
  { id: "meld", label: "Meld", category: "Expansion" },
  { id: "goad", label: "Goad", category: "Expansion" },
  { id: "exert", label: "Exert", category: "Expansion" },
  { id: "explore", label: "Explore", category: "Expansion" },
  { id: "surveil", label: "Surveil", category: "Expansion" },
  { id: "adapt", label: "Adapt", category: "Expansion" },
  { id: "amass", label: "Amass", category: "Expansion" },
  { id: "learn", label: "Learn", category: "Expansion" },
  { id: "venture", label: "Venture into the dungeon", category: "Expansion" },
  { id: "connive", label: "Connive", category: "Expansion" },
  { id: "incubate", label: "Incubate", category: "Expansion" },
  { id: "discover", label: "Discover", category: "Expansion" },
  { id: "collect_evidence", label: "Collect evidence", category: "Expansion" },
  { id: "suspect", label: "Suspect", category: "Expansion" },
  { id: "cloak", label: "Cloak", category: "Expansion" },
  { id: "saddle", label: "Saddle", category: "Expansion" },
  { id: "foretell", label: "Foretell", category: "Expansion" },
  { id: "plot", label: "Plot", category: "Expansion" },
  { id: "manifest_dread", label: "Manifest dread", category: "Expansion" },
  {
    id: "ring_tempts_you",
    label: "The Ring tempts you",
    category: "Expansion",
  },
  {
    id: "take_the_initiative",
    label: "Take the initiative",
    category: "Expansion",
  },
];

export const KEYWORD_ABILITIES = [
  // Evergreen
  { id: "deathtouch", label: "Deathtouch", category: "Evergreen" },
  { id: "defender", label: "Defender", category: "Evergreen" },
  { id: "double_strike", label: "Double strike", category: "Evergreen" },
  { id: "first_strike", label: "First strike", category: "Evergreen" },
  { id: "flash", label: "Flash", category: "Evergreen" },
  { id: "flying", label: "Flying", category: "Evergreen" },
  { id: "haste", label: "Haste", category: "Evergreen" },
  { id: "hexproof", label: "Hexproof", category: "Evergreen" },
  { id: "indestructible", label: "Indestructible", category: "Evergreen" },
  { id: "lifelink", label: "Lifelink", category: "Evergreen" },
  { id: "menace", label: "Menace", category: "Evergreen" },
  { id: "protection", label: "Protection", category: "Evergreen" },
  { id: "reach", label: "Reach", category: "Evergreen" },
  { id: "trample", label: "Trample", category: "Evergreen" },
  { id: "vigilance", label: "Vigilance", category: "Evergreen" },
  { id: "ward", label: "Ward", category: "Evergreen" },

  // Deciduous
  { id: "cycling", label: "Cycling", category: "Deciduous" },
  { id: "equip", label: "Equip", category: "Deciduous" },
  { id: "kicker", label: "Kicker", category: "Deciduous" },
  { id: "flashback", label: "Flashback", category: "Deciduous" },
  { id: "crew", label: "Crew", category: "Deciduous" },

  // Expansion
  { id: "affinity", label: "Affinity", category: "Expansion" },
  { id: "annihilator", label: "Annihilator", category: "Expansion" },
  { id: "battle_cry", label: "Battle cry", category: "Expansion" },
  { id: "bestow", label: "Bestow", category: "Expansion" },
  { id: "bloodthirst", label: "Bloodthirst", category: "Expansion" },
  { id: "bushido", label: "Bushido", category: "Expansion" },
  { id: "buyback", label: "Buyback", category: "Expansion" },
  { id: "cascade", label: "Cascade", category: "Expansion" },
  { id: "changeling", label: "Changeling", category: "Expansion" },
  { id: "cipher", label: "Cipher", category: "Expansion" },
  { id: "companion", label: "Companion", category: "Expansion" },
  { id: "conspire", label: "Conspire", category: "Expansion" },
  { id: "convoke", label: "Convoke", category: "Expansion" },
  {
    id: "cumulative_upkeep",
    label: "Cumulative upkeep",
    category: "Expansion",
  },
  { id: "dash", label: "Dash", category: "Expansion" },
  { id: "daybound", label: "Daybound", category: "Expansion" },
  { id: "nightbound", label: "Nightbound", category: "Expansion" },
  { id: "decayed", label: "Decayed", category: "Expansion" },
  { id: "delve", label: "Delve", category: "Expansion" },
  { id: "devoid", label: "Devoid", category: "Expansion" },
  { id: "devour", label: "Devour", category: "Expansion" },
  { id: "disturb", label: "Disturb", category: "Expansion" },
  { id: "dredge", label: "Dredge", category: "Expansion" },
  { id: "echo", label: "Echo", category: "Expansion" },
  { id: "embalm", label: "Embalm", category: "Expansion" },
  { id: "emerge", label: "Emerge", category: "Expansion" },
  { id: "entwine", label: "Entwine", category: "Expansion" },
  { id: "escape", label: "Escape", category: "Expansion" },
  { id: "eternalize", label: "Eternalize", category: "Expansion" },
  { id: "evoke", label: "Evoke", category: "Expansion" },
  { id: "evolve", label: "Evolve", category: "Expansion" },
  { id: "exalted", label: "Exalted", category: "Expansion" },
  { id: "exploit", label: "Exploit", category: "Expansion" },
  { id: "extort", label: "Extort", category: "Expansion" },
  { id: "fabricate", label: "Fabricate", category: "Expansion" },
  { id: "fading", label: "Fading", category: "Expansion" },
  { id: "fear", label: "Fear", category: "Expansion" },
  { id: "flanking", label: "Flanking", category: "Expansion" },
  { id: "forecast", label: "Forecast", category: "Expansion" },
  { id: "fuse", label: "Fuse", category: "Expansion" },
  { id: "graft", label: "Graft", category: "Expansion" },
  { id: "gravestorm", label: "Gravestorm", category: "Expansion" },
  { id: "haunt", label: "Haunt", category: "Expansion" },
  { id: "hideaway", label: "Hideaway", category: "Expansion" },
  { id: "horsemanship", label: "Horsemanship", category: "Expansion" },
  { id: "improvise", label: "Improvise", category: "Expansion" },
  { id: "infect", label: "Infect", category: "Expansion" },
  { id: "intimidate", label: "Intimidate", category: "Expansion" },
  { id: "jump_start", label: "Jump-start", category: "Expansion" },
  { id: "level_up", label: "Level up", category: "Expansion" },
  { id: "living_weapon", label: "Living weapon", category: "Expansion" },
  { id: "madness", label: "Madness", category: "Expansion" },
  { id: "megamorph", label: "Megamorph", category: "Expansion" },
  { id: "mentor", label: "Mentor", category: "Expansion" },
  { id: "miracle", label: "Miracle", category: "Expansion" },
  { id: "modular", label: "Modular", category: "Expansion" },
  { id: "morph", label: "Morph", category: "Expansion" },
  { id: "mutate", label: "Mutate", category: "Expansion" },
  { id: "myriad", label: "Myriad", category: "Expansion" },
  { id: "ninjutsu", label: "Ninjutsu", category: "Expansion" },
  { id: "outlast", label: "Outlast", category: "Expansion" },
  { id: "overload", label: "Overload", category: "Expansion" },
  { id: "partner", label: "Partner", category: "Expansion" },
  { id: "persist", label: "Persist", category: "Expansion" },
  { id: "phasing", label: "Phasing", category: "Expansion" },
  { id: "poisonous", label: "Poisonous", category: "Expansion" },
  { id: "provoke", label: "Provoke", category: "Expansion" },
  { id: "prowess", label: "Prowess", category: "Expansion" },
  { id: "prowl", label: "Prowl", category: "Expansion" },
  { id: "rebound", label: "Rebound", category: "Expansion" },
  { id: "reconfigure", label: "Reconfigure", category: "Expansion" },
  { id: "reinforce", label: "Reinforce", category: "Expansion" },
  { id: "renown", label: "Renown", category: "Expansion" },
  { id: "replicate", label: "Replicate", category: "Expansion" },
  { id: "retrace", label: "Retrace", category: "Expansion" },
  { id: "riot", label: "Riot", category: "Expansion" },
  { id: "shadow", label: "Shadow", category: "Expansion" },
  { id: "shroud", label: "Shroud", category: "Expansion" },
  { id: "skulk", label: "Skulk", category: "Expansion" },
  { id: "soulbond", label: "Soulbond", category: "Expansion" },
  { id: "spectacle", label: "Spectacle", category: "Expansion" },
  { id: "splice", label: "Splice", category: "Expansion" },
  { id: "split_second", label: "Split second", category: "Expansion" },
  { id: "storm", label: "Storm", category: "Expansion" },
  { id: "sunburst", label: "Sunburst", category: "Expansion" },
  { id: "surge", label: "Surge", category: "Expansion" },
  { id: "suspend", label: "Suspend", category: "Expansion" },
  { id: "totem_armor", label: "Totem armor", category: "Expansion" },
  { id: "toxic", label: "Toxic", category: "Expansion" },
  { id: "training", label: "Training", category: "Expansion" },
  { id: "transmute", label: "Transmute", category: "Expansion" },
  { id: "tribute", label: "Tribute", category: "Expansion" },
  { id: "undying", label: "Undying", category: "Expansion" },
  { id: "unearth", label: "Unearth", category: "Expansion" },
  { id: "unleash", label: "Unleash", category: "Expansion" },
  { id: "vanishing", label: "Vanishing", category: "Expansion" },
  { id: "wither", label: "Wither", category: "Expansion" },
];

export const NON_KEYWORD_ACTIONS = [
  // Damage
  { id: "deal_damage", label: "Deal X damage to", category: "Damage" },
  {
    id: "deal_damage_to_each",
    label: "Deal X damage to each creature/player",
    category: "Damage",
  },
  {
    id: "deal_damage_equal_to_power",
    label: "Deal damage equal to its power",
    category: "Damage",
  },
  {
    id: "deal_damage_divided",
    label: "Deal X damage divided as you choose",
    category: "Damage",
  },
  {
    id: "prevent_damage",
    label: "Prevent the next X damage",
    category: "Damage",
  },
  { id: "prevent_all_damage", label: "Prevent all damage", category: "Damage" },
  { id: "double_damage", label: "Double the damage", category: "Damage" },
  {
    id: "damage_cant_be_prevented",
    label: "Damage can't be prevented",
    category: "Damage",
  },

  // Life
  { id: "gain_life", label: "Gain X life", category: "Life" },
  { id: "lose_life", label: "Lose X life", category: "Life" },
  { id: "pay_life", label: "Pay X life", category: "Life" },
  {
    id: "each_opponent_loses_life",
    label: "Each opponent loses X life",
    category: "Life",
  },
  { id: "set_life_total", label: "Set life total to X", category: "Life" },
  {
    id: "exchange_life_totals",
    label: "Exchange life totals",
    category: "Life",
  },
  { id: "double_life", label: "Double your life total", category: "Life" },
  {
    id: "drain_life",
    label: "Target loses X life and you gain X life",
    category: "Life",
  },

  // Card Draw
  { id: "draw_cards", label: "Draw X cards", category: "Card Draw" },
  {
    id: "draw_card_for_each",
    label: "Draw a card for each",
    category: "Card Draw",
  },
  {
    id: "target_player_draws",
    label: "Target player draws X cards",
    category: "Card Draw",
  },
  {
    id: "each_player_draws",
    label: "Each player draws X cards",
    category: "Card Draw",
  },
  {
    id: "look_at_top_x",
    label: "Look at the top X cards of your library",
    category: "Card Draw",
  },
  {
    id: "put_on_top_of_library",
    label: "Put on top of your library",
    category: "Card Draw",
  },
  {
    id: "put_on_bottom_of_library",
    label: "Put on the bottom of your library",
    category: "Card Draw",
  },
  {
    id: "put_into_hand_from_library",
    label: "Search library, put into hand",
    category: "Card Draw",
  },
  {
    id: "draw_then_discard",
    label: "Draw X, then discard X",
    category: "Card Draw",
  },
  {
    id: "discard_then_draw",
    label: "Discard X, then draw X",
    category: "Card Draw",
  },

  // Mana
  { id: "add_mana", label: "Add {mana}", category: "Mana" },
  {
    id: "add_mana_any_color",
    label: "Add one mana of any color",
    category: "Mana",
  },
  { id: "add_colorless_mana", label: "Add {C}", category: "Mana" },
  { id: "create_treasure", label: "Create a Treasure token", category: "Mana" },
  { id: "reduce_cost", label: "Costs {X} less to cast", category: "Mana" },
  { id: "increase_cost", label: "Costs {X} more to cast", category: "Mana" },
  {
    id: "spells_cost_less",
    label: "Spells you cast cost {X} less",
    category: "Mana",
  },
  {
    id: "spells_cost_more",
    label: "Opponent's spells cost {X} more",
    category: "Mana",
  },

  // Counters
  {
    id: "put_plus1_counters",
    label: "Put X +1/+1 counter(s) on",
    category: "Counters",
  },
  {
    id: "put_minus1_counters",
    label: "Put X -1/-1 counter(s) on",
    category: "Counters",
  },
  {
    id: "remove_counter",
    label: "Remove a counter from",
    category: "Counters",
  },
  { id: "move_counters", label: "Move counters", category: "Counters" },
  {
    id: "double_counters",
    label: "Double the number of counters on",
    category: "Counters",
  },
  {
    id: "put_shield_counter",
    label: "Put a shield counter on",
    category: "Counters",
  },
  {
    id: "put_stun_counter",
    label: "Put a stun counter on",
    category: "Counters",
  },
  {
    id: "poison_counter",
    label: "Give target player a poison counter",
    category: "Counters",
  },
  {
    id: "energy_counter",
    label: "Get {E} (energy counter)",
    category: "Counters",
  },
  {
    id: "experience_counter",
    label: "Get an experience counter",
    category: "Counters",
  },

  // Control
  { id: "gain_control", label: "Gain control of target", category: "Control" },
  {
    id: "gain_control_until_eot",
    label: "Gain control until end of turn",
    category: "Control",
  },
  {
    id: "exchange_control",
    label: "Exchange control of two permanents",
    category: "Control",
  },

  // Copy
  { id: "copy_spell", label: "Copy target spell", category: "Copy" },
  {
    id: "copy_permanent",
    label: "Create a copy of target permanent",
    category: "Copy",
  },
  {
    id: "become_copy",
    label: "Becomes a copy of target creature",
    category: "Copy",
  },
  {
    id: "token_copy",
    label: "Create a token that's a copy of",
    category: "Copy",
  },

  // Bounce/Return
  {
    id: "return_to_hand",
    label: "Return to owner's hand",
    category: "Bounce/Return",
  },
  {
    id: "return_from_graveyard_to_hand",
    label: "Return from graveyard to hand",
    category: "Bounce/Return",
  },
  {
    id: "return_from_graveyard_to_battlefield",
    label: "Return from graveyard to battlefield",
    category: "Bounce/Return",
  },
  {
    id: "return_from_exile",
    label: "Return from exile to battlefield",
    category: "Bounce/Return",
  },
  {
    id: "return_to_top_of_library",
    label: "Put on top of owner's library",
    category: "Bounce/Return",
  },
  {
    id: "reanimate",
    label: "Put creature from graveyard onto battlefield",
    category: "Bounce/Return",
  },

  // Battlefield
  {
    id: "put_onto_battlefield",
    label: "Put onto the battlefield",
    category: "Battlefield",
  },
  {
    id: "put_onto_battlefield_tapped",
    label: "Put onto battlefield tapped",
    category: "Battlefield",
  },
  {
    id: "put_land_onto_battlefield",
    label: "Put a land onto the battlefield",
    category: "Battlefield",
  },

  // P/T Modification
  {
    id: "gets_plus_x",
    label: "Gets +X/+X until end of turn",
    category: "P/T Modification",
  },
  {
    id: "gets_minus_x",
    label: "Gets -X/-X until end of turn",
    category: "P/T Modification",
  },
  {
    id: "creatures_get_plus_x",
    label: "Creatures you control get +X/+X",
    category: "P/T Modification",
  },
  {
    id: "creatures_get_minus_x",
    label: "Creatures get -X/-X",
    category: "P/T Modification",
  },
  {
    id: "set_power_toughness",
    label: "Has base power and toughness X/X",
    category: "P/T Modification",
  },
  {
    id: "switch_power_toughness",
    label: "Switch power and toughness",
    category: "P/T Modification",
  },
  {
    id: "double_power",
    label: "Double target creature's power",
    category: "P/T Modification",
  },

  // Abilities
  {
    id: "gains_ability",
    label: "Gains [ability] until end of turn",
    category: "Abilities",
  },
  {
    id: "gains_ability_permanent",
    label: "Has [ability]",
    category: "Abilities",
  },
  {
    id: "loses_all_abilities",
    label: "Loses all abilities",
    category: "Abilities",
  },
  {
    id: "creatures_gain_ability",
    label: "Creatures you control gain [ability]",
    category: "Abilities",
  },

  // Combat Modification
  { id: "cant_be_blocked", label: "Can't be blocked", category: "Combat Mod" },
  {
    id: "must_be_blocked",
    label: "Must be blocked if able",
    category: "Combat Mod",
  },
  {
    id: "must_attack",
    label: "Must attack each combat if able",
    category: "Combat Mod",
  },
  { id: "cant_attack", label: "Can't attack", category: "Combat Mod" },
  { id: "cant_block", label: "Can't block", category: "Combat Mod" },
  {
    id: "doesnt_untap",
    label: "Doesn't untap during untap step",
    category: "Combat Mod",
  },
  {
    id: "tapped_and_doesnt_untap",
    label: "Tap; doesn't untap next untap step",
    category: "Combat Mod",
  },
  {
    id: "additional_combat",
    label: "Additional combat phase",
    category: "Combat Mod",
  },

  // Tokens
  {
    id: "create_creature_token",
    label: "Create X/X creature token(s)",
    category: "Tokens",
  },
  {
    id: "create_treasure_token",
    label: "Create a Treasure token",
    category: "Tokens",
  },
  { id: "create_food_token", label: "Create a Food token", category: "Tokens" },
  { id: "create_clue_token", label: "Create a Clue token", category: "Tokens" },
  {
    id: "create_blood_token",
    label: "Create a Blood token",
    category: "Tokens",
  },
  {
    id: "create_copy_token",
    label: "Create a token copy of",
    category: "Tokens",
  },

  // Removal
  { id: "destroy_target", label: "Destroy target", category: "Removal" },
  {
    id: "destroy_all_creatures",
    label: "Destroy all creatures",
    category: "Removal",
  },
  {
    id: "destroy_all_nonland",
    label: "Destroy all nonland permanents",
    category: "Removal",
  },
  {
    id: "destroy_all_artifacts",
    label: "Destroy all artifacts",
    category: "Removal",
  },
  {
    id: "destroy_all_enchantments",
    label: "Destroy all enchantments",
    category: "Removal",
  },
  { id: "exile_target", label: "Exile target", category: "Removal" },
  { id: "exile_all", label: "Exile all [type]", category: "Removal" },
  {
    id: "exile_until_leaves",
    label: "Exile until this leaves",
    category: "Removal",
  },
  {
    id: "sacrifice_permanent",
    label: "Sacrifice a [permanent]",
    category: "Removal",
  },
  {
    id: "opponent_sacrifices",
    label: "Opponent sacrifices a [permanent]",
    category: "Removal",
  },
  {
    id: "exile_from_graveyard",
    label: "Exile card from graveyard",
    category: "Removal",
  },

  // Randomness
  { id: "flip_coin", label: "Flip a coin", category: "Randomness" },
  { id: "roll_d20", label: "Roll a d20", category: "Randomness" },
  { id: "roll_die", label: "Roll a six-sided die", category: "Randomness" },

  // Modal
  { id: "choose_one", label: "Choose one —", category: "Modal" },
  { id: "choose_two", label: "Choose two —", category: "Modal" },
  {
    id: "choose_one_or_both",
    label: "Choose one or both —",
    category: "Modal",
  },
  {
    id: "choose_creature_type",
    label: "Choose a creature type",
    category: "Modal",
  },
  { id: "choose_color", label: "Choose a color", category: "Modal" },

  // Phase/Turn
  { id: "phase_out_action", label: "Phase out", category: "Phase/Turn" },
  {
    id: "take_extra_turn",
    label: "Take an extra turn",
    category: "Phase/Turn",
  },
  { id: "end_the_turn", label: "End the turn", category: "Phase/Turn" },
  {
    id: "skip_draw_step",
    label: "Skip your draw step",
    category: "Phase/Turn",
  },

  // Protection
  {
    id: "protection_from_color",
    label: "Gains protection from [color]",
    category: "Protection",
  },
  {
    id: "indestructible_grant",
    label: "Is indestructible",
    category: "Protection",
  },
  {
    id: "cant_be_countered",
    label: "Can't be countered",
    category: "Protection",
  },

  // Game State
  {
    id: "target_player_loses",
    label: "Target player loses the game",
    category: "Game State",
  },
  { id: "you_win", label: "You win the game", category: "Game State" },
  { id: "cant_lose", label: "You can't lose the game", category: "Game State" },
  {
    id: "become_monarch",
    label: "You become the monarch",
    category: "Game State",
  },

  // Disruption
  {
    id: "each_opponent_discards",
    label: "Each opponent discards X cards",
    category: "Disruption",
  },
  {
    id: "target_player_discards",
    label: "Target player discards X cards",
    category: "Disruption",
  },
  {
    id: "cant_cast_spells",
    label: "Can't cast spells this turn",
    category: "Disruption",
  },

  // Ramp
  {
    id: "search_library_for_land",
    label: "Search library for a land card",
    category: "Ramp",
  },
  {
    id: "search_library_for_basic",
    label: "Search library for a basic land",
    category: "Ramp",
  },
  {
    id: "put_land_from_library",
    label: "Put land from library onto battlefield tapped",
    category: "Ramp",
  },
  {
    id: "additional_land_play",
    label: "Play an additional land this turn",
    category: "Ramp",
  },

  // Untap
  {
    id: "untap_all",
    label: "Untap all creatures/permanents you control",
    category: "Untap",
  },
  { id: "untap_target", label: "Untap target permanent", category: "Untap" },
  { id: "tap_target", label: "Tap target permanent", category: "Untap" },
  {
    id: "tap_all_opponents",
    label: "Tap all creatures opponent controls",
    category: "Untap",
  },
];

// Helper: get unique categories from a data array
export function getCategories(data) {
  return [...new Set(data.map((d) => d.category))];
}

// All actions combined (keyword + non-keyword) for the Actions panel
export const ALL_ACTIONS = [
  ...KEYWORD_ACTIONS.map((a) => ({ ...a, type: "keyword" })),
  ...NON_KEYWORD_ACTIONS.map((a) => ({ ...a, type: "non-keyword" })),
  ...KEYWORD_ABILITIES.map((a) => ({ ...a, type: "ability" })),
];
