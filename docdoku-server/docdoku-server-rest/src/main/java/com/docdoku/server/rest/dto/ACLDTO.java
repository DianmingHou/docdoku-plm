/*
 * DocDoku, Professional Open Source
 * Copyright 2006 - 2015 DocDoku SARL
 *
 * This file is part of DocDokuPLM.
 *
 * DocDokuPLM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DocDokuPLM is distributed in the hope that it will be useful,  
 * but WITHOUT ANY WARRANTY; without even the implied warranty of  
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the  
 * GNU Affero General Public License for more details.  
 *  
 * You should have received a copy of the GNU Affero General Public License  
 * along with DocDokuPLM.  If not, see <http://www.gnu.org/licenses/>.  
 */

package com.docdoku.server.rest.dto;

import com.docdoku.core.security.ACL;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@XmlRootElement
@ApiModel(value="ACLDTO", description="This class is the representation of an {@link com.docdoku.core.security.ACL} entity")
public class ACLDTO implements Serializable {

    @XmlElement(nillable = true)
    @ApiModelProperty(value = "Users ACL entries")
    protected Map<String, ACL.Permission> userEntries = new HashMap<String, ACL.Permission>();

    @XmlElement(nillable = true)
    @ApiModelProperty(value = "Groups ACL entries")
    protected Map<String, ACL.Permission> groupEntries = new HashMap<String, ACL.Permission>();

    public ACLDTO() {
    }

    public void addUserEntry(String login, ACL.Permission perm) {
        userEntries.put(login, perm);
    }

    public void addGroupEntry(String groupId, ACL.Permission perm) {
        groupEntries.put(groupId, perm);
    }

    public void removeUserEntry(String login) {
        userEntries.remove(login);
    }

    public void removeGroupEntry(String groupId) {
        groupEntries.remove(groupId);
    }

    public Map<String, ACL.Permission> getGroupEntries() {
        return groupEntries;
    }

    public void setGroupEntries(Map<String, ACL.Permission> groupEntries) {
        this.groupEntries = groupEntries;
    }

    public Map<String, ACL.Permission> getUserEntries() {
        return userEntries;
    }

    public void setUserEntries(Map<String, ACL.Permission> userEntries) {
        this.userEntries = userEntries;
    }

}