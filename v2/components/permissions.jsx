// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useData, useFetcher } from '../data-provider'
import { localizePermissions } from '../../shared/js/ui/templates/site'
import { PageOuter } from './page-outer'
import { UpdatePermissionMessage } from '../../shared/js/browser/common'

export function Permissions() {
    const data = useData()
    if (!data.permissions || data.permissions.length === 0) {
        return null
    }
    const localizedPerms = localizePermissions(data.permissions)
    const fetcher = useFetcher()

    /**
     * @param {string} id
     * @param {string} value
     */
    function update(id, value) {
        console.log(id, value)
        fetcher(new UpdatePermissionMessage({ id, value })).catch((e) => console.error(e))
    }
    return (
        <PageOuter>
            <div className="site-info__li--manage-permissions">
                {localizedPerms.map(({ key: permissionId, title, permission, options }) => {
                    return (
                        <div className="site-info__page-permission">
                            <label>
                                <div>
                                    <div className="site-info__page-permission__icon" data-icon={permissionId}></div>
                                    {title}
                                </div>
                                <select name={permissionId} onChange={(e) => update(permissionId, /** @type {any} */ (e.target).value)}>
                                    {options.map(({ id, title }) => (
                                        <option value={id} selected={permission === id}>
                                            {title}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    )
                })}
            </div>
        </PageOuter>
    )
}
