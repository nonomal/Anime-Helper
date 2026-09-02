// 【filter】"none", "progress", "onUpdate", "updateDone", "watchDone", "search", "weekday"
// 【sort】"az", "za", "add_new_old", "add_old_new", "update_first", "update_end"
const onUpdateCondition = `(time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) < episode)`;

export function toSql(filter: string, param: string | undefined, sort: string | undefined): string {

  let orderBy: string;
  switch (sort) {
    case "az":
      orderBy = "ORDER BY pinyin ASC";
      break;
    case "za":
      orderBy = "ORDER BY pinyin DESC";
      break;
    case "add_old_new":
      orderBy = "ORDER BY ROWID ASC";
      break;
    case "update_first":
      orderBy = `ORDER BY CASE WHEN ${onUpdateCondition} THEN 0 ELSE 1 END, ROWID DESC`;
      break;
    case "update_end":
      orderBy = `ORDER BY CASE WHEN ${onUpdateCondition} THEN 1 ELSE 0 END, ROWID DESC`;
      break;
    default:
      orderBy = "ORDER BY ROWID DESC";
  }

  const limitClause = "LIMIT ? OFFSET ?";

  switch (filter){
    case "none":
      return `SELECT * FROM list ${orderBy} ${limitClause}`;
    case "progress":
      return `SELECT * FROM list
      WHERE (
        (time = 0 AND now < episode)
        OR
        (time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) < episode)
        OR
        (time != 0 AND ((((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) >= episode) AND now < episode)
      )
      ${orderBy}
      ${limitClause}`;
    case "onUpdate":
      return `SELECT * FROM list
      WHERE ${onUpdateCondition}
      ${orderBy}
      ${limitClause}`;
    case "updateDone":
      return `SELECT * FROM list
      WHERE (
        (time = 0)
        OR
        (time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) >= episode)
      )
      ${orderBy}
      ${limitClause}`;
    case "watchDone":
      return `SELECT * FROM list
      WHERE (
        (time = 0 AND now = episode)
        OR
        (time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) >= episode AND now = episode)
      )
      ${orderBy}
      ${limitClause}`;
    case "search":
      return `SELECT * FROM list
      WHERE title LIKE '%${param}%'
      ${orderBy}
      ${limitClause}`;
    case "weekday":
      return `SELECT * FROM list
      WHERE (
        strftime('%w', time / 1000, 'unixepoch', 'localtime') = '${param}'
        AND
        (
          ${onUpdateCondition}
          OR
          (time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) = episode AND strftime('%w', 'now', 'localtime') = '${param}')
        )
      )
      ${orderBy}
      ${limitClause}`;
    case "unwatched":
      return `SELECT * FROM list
      WHERE (
        (time = 0 AND now < episode)
        OR
        (time != 0
          AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) < episode
          AND now < (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000)
        )
        OR
        (time != 0 AND ((((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) >= episode) AND now < episode)
      )
      ${orderBy}
      ${limitClause}`;
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
        (
          (time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) < episode)
          OR
          (time != 0 AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) = episode AND strftime('%w', 'now', 'localtime') = '${param}')
        )
      )`;
    case "unwatched":
      return `SELECT COUNT(*) as count FROM list
      WHERE (
        (time = 0 AND now < episode)
        OR
        (time != 0
          AND (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) < episode
          AND now < (((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000)
        )
        OR
        (time != 0 AND ((((strftime('%s','now') * 1000) - time + 604800000 - 1) / 604800000) >= episode) AND now < episode)
      )`;
    default:
      return "";
  }
}