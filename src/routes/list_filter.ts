// 【filter】"none", "progress", "onUpdate", "updateDone", "watchDone", "search", "weekday"
// 【sort】"az", "za", "add_new_old", "add_old_new", "update_first", "update_end"
export function toSql(filter: string, param: string | undefined, sort: string | undefined): string {

  switch (filter){
    case "none":
      return `SELECT * FROM list ORDER BY ROWID DESC LIMIT ? OFFSET ?`;
    case "progress":
      return `SELECT * FROM list
      WHERE (
        (time = 0 AND now < episode)
        OR
        (time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) < episode)
        OR
        (time != 0 AND ((((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) >= episode) AND now < episode)
      )
      ORDER BY ROWID DESC
      LIMIT ? OFFSET ? `
    case "onUpdate":
      return `SELECT * FROM list
      WHERE (time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) < episode)
      ORDER BY ROWID DESC
      LIMIT ? OFFSET ? `
    case "updateDone":
      return `SELECT * FROM list
      WHERE (
        (time = 0)
        OR
        (time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) >= episode)
      )
      ORDER BY ROWID DESC
      LIMIT ? OFFSET ? `
    case "watchDone":
      return `SELECT * FROM list
      WHERE (
        (time = 0 AND now = episode)
        OR
        (time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) >= episode AND now = episode)
      )
      ORDER BY ROWID DESC
      LIMIT ? OFFSET ? `
    case "search":
      return `SELECT * FROM list
      WHERE title LIKE '%${param}%'
      ORDER BY ROWID DESC
      LIMIT ? OFFSET ? `
    case "weekday":
      return `SELECT * FROM list
      WHERE (
        strftime('%w', time / 1000, 'unixepoch', 'localtime') = '${param}'
        AND
        (time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) < episode)
      )
      ORDER BY ROWID DESC
      LIMIT ? OFFSET ? `
    default:
      return "";
  }
}

export function calCount(filter: string, param: string | undefined) {
  switch (filter) {
    case "none":
      return `SELECT COUNT(*) as count FROM list`;
    case "progress":
      return `SELECT COUNT(*) as count FROM list
      WHERE (
        (time = 0 AND now < episode)
        OR
        (time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) < episode)
        OR
        (time != 0 AND ((((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) >= episode) AND now < episode)
      )`;
    case "onUpdate":
      return `SELECT COUNT(*) as count FROM list
      WHERE (time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) < episode)`;
    case "updateDone":
      return `SELECT COUNT(*) as count FROM list
      WHERE (
        (time = 0)
        OR
        (time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) >= episode)
      )`;
    case "watchDone":
      return `SELECT COUNT(*) as count FROM list
      WHERE (
        (time = 0 AND now = episode)
        OR
        (time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) >= episode AND now = episode)
      )`;
    case "search":
      return `SELECT COUNT(*) as count FROM list
      WHERE title LIKE '%${param}%'`;
    case "weekday":
      return `SELECT COUNT(*) as count FROM list
      WHERE (
        strftime('%w', time / 1000, 'unixepoch', 'localtime') = '${param}'
        AND
        (time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) < episode)
      )`;
    default:
      return "";
  }
}